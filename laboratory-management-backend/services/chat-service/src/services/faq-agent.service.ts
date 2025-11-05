import { InferenceClient } from "@huggingface/inference";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { Db } from "mongodb";
import { z } from "zod";

interface CallFAQAgentParams {
  db: Db;
  query: string;
  threadId: string;
}

interface FAQLookupResult {
  results: any[];
  searchType: "text" | "semantic";
  query: string;
  count: number;
}

async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.status === 429 && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        console.log(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

export async function callFAQAgent({ db, query, threadId }: CallFAQAgentParams) {
  try {
    const collection = db.collection("faq");

    const GraphState = Annotation.Root({
      messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
      }),
    });

    const faqLookupTool = tool(
      async ({ query, n = 5 }): Promise<string> => {
        try {
          console.log("FAQ lookup tool called with query:", query);

          // Simple text search on FAQ collection
          const textResults = await collection
            .find({
              $or: [
                { question: { $regex: query, $options: "i" } },
                { answer: { $regex: query, $options: "i" } },
                { tags: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
              ],
            })
            .limit(n)
            .toArray();

          console.log(`Text search returned ${textResults.length} FAQ results`);

          // Format results to be more readable
          const formattedResults = textResults.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            tags: faq.tags,
          }));

          const result: FAQLookupResult = {
            results: formattedResults,
            searchType: "text",
            query: query,
            count: formattedResults.length,
          };

          return JSON.stringify(result);
        } catch (error: any) {
          console.error("Error in FAQ lookup:", error);
          return JSON.stringify({
            error: "Failed to search FAQ",
            details: error.message,
            query: query,
          });
        }
      },
      {
        name: "faq_lookup",
        description:
          "Searches the FAQ database for answers to common questions about laboratory services, hours, booking, payments, and general information. Use this for any general inquiries.",
        schema: z.object({
          query: z.string().describe("The search query"),
          n: z.number().optional().default(5).describe("Number of results to return"),
        }),
      }
    );

    const tools = [faqLookupTool];
    const toolNode = new ToolNode<typeof GraphState.State>(tools);

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0,
      maxRetries: 0,
      apiKey: process.env.GOOGLE_API_KEY || "",
    }).bindTools(tools);

    function shouldContinue(state: typeof GraphState.State) {
      const messages = state.messages;
      const lastMessage = messages[messages.length - 1] as AIMessage;

      if (lastMessage.tool_calls?.length) {
        return "tools";
      }
      return "__end__";
    }

    async function callModel(state: typeof GraphState.State) {
      return retryWithBackoff(async () => {
        const prompt = ChatPromptTemplate.fromMessages([
          [
            "system",
            `You are a helpful FAQ Assistant for a healthcare laboratory system.

Your role is to answer common questions about:
- Laboratory operating hours and location
- How to book appointments and tests
- Required documents and preparation
- Test results and timing
- Payment methods and insurance
- Services offered
- Contact information

IMPORTANT: 
- ALWAYS use the faq_lookup tool to search for relevant information
- Base your answers on the FAQ data provided by the tool
- If the FAQ doesn't contain the answer, politely say so and suggest contacting support
- Be friendly, clear, and concise
- Do NOT make up information not found in the FAQ

Current time: {time}`,
          ],
          new MessagesPlaceholder("messages"),
        ]);

        const formattedPrompt = await prompt.formatMessages({
          time: new Date().toISOString(),
          messages: state.messages,
        });

        const result = await model.invoke(formattedPrompt);
        return { messages: [result] };
      });
    }

    const workflow = new StateGraph(GraphState)
      .addNode("agent", callModel)
      .addNode("tools", toolNode)
      .addEdge("__start__", "agent")
      .addConditionalEdges("agent", shouldContinue)
      .addEdge("tools", "agent");

    const checkpointer = new MongoDBSaver({
      client: db.client as any,
      dbName: db.databaseName,
    });
    const app = workflow.compile({ checkpointer });

    const finalState = await app.invoke(
      {
        messages: [new HumanMessage(query)],
      },
      {
        recursionLimit: 15,
        configurable: { thread_id: threadId },
      }
    );

    if (!finalState?.messages?.length) {
      throw new Error("No messages found in the conversation state");
    }

    const lastMessage = finalState.messages[finalState.messages.length - 1];
    const response = lastMessage?.content;

    if (!response) {
      throw new Error("No content in the last message");
    }

    console.log("FAQ Agent response:", response);
    return response;
  } catch (error: any) {
    console.error("Error in callFAQAgent:", error.message);

    if (error.status === 429) {
      throw new Error("Service temporarily unavailable. Please try again in a minute.");
    } else if (error.status === 401) {
      throw new Error("Authentication failed. Please check your API configuration.");
    } else {
      throw new Error(`FAQ Agent failed: ${error.message}`);
    }
  }
}
