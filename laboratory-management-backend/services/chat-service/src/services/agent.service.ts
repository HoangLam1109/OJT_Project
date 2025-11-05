import { InferenceClient } from '@huggingface/inference';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StateGraph } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { Db } from "mongodb";
import { z } from "zod";

// Types
interface CallAgentParams {
  db: Db;
  query: string;
  threadId: string;
}

interface ItemLookupInput {
  query: string;
  n?: number;
}

interface ItemLookupResult {
  results: any[];
  searchType: "vector" | "text";
  query: string;
  count: number;
}

interface ItemLookupError {
  error: string;
  details?: string;
  query?: string;
  message?: string;
  count?: number;
}

// Utility function to handle API rate limits with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
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

export async function callAgent({ db, query, threadId }: CallAgentParams) {
  try {
    const collection = db.collection("Patient");

    // Define the state structure for the agent workflow
    const GraphState = Annotation.Root({
      messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
      }),
    });

    const itemLookupTool = tool(
      async ({ query, n = 10 }: ItemLookupInput): Promise<string> => {
        try {
          console.log("Item lookup tool called with query:", query);

          const totalCount = await collection.countDocuments();
          console.log(`Total documents in collection: ${totalCount}`);

          if (totalCount === 0) {
            console.log("Collection is empty");
            const result: ItemLookupError = {
              error: "No items found in inventory",
              message: "The inventory database appears to be empty",
              count: 0,
            };
            return JSON.stringify(result);
          }

          const sampleDocs = await collection.find({}).limit(3).toArray();
          console.log("Sample documents:", sampleDocs);

          const dbConfig = {
            collection: collection,
            indexName: "vector_index",
            textKey: "embedding_text",
            embeddingKey: "embedding",
          };

          const hf = new InferenceClient(process.env.HF_ACCESS_TOKEN);
          
          const vectorStore = new MongoDBAtlasVectorSearch(
            {
              embedDocuments: async (texts: string[]): Promise<number[][]> => {
                const embeddings: number[][] = [];
                for (const text of texts) {
                  try {
                    const response = await hf.featureExtraction({
                      model: 'sentence-transformers/all-MiniLM-L6-v2',
                      inputs: text,
                    });
                    
                    // Ensure the response is always a number[]
                    let embedding: number[];
                    if (Array.isArray(response)) {
                      // If it's already an array of numbers, use it directly
                      if (response.length > 0 && typeof response[0] === 'number') {
                        embedding = response as number[];
                      } 
                      // If it's an array of arrays, take the first one
                      else if (response.length > 0 && Array.isArray(response[0])) {
                        embedding = (response as number[][])[0] || [];
                      } else {
                        embedding = [];
                      }
                    } else {
                      // If it's a single number, wrap it in an array
                      embedding = typeof response === 'number' ? [response] : [];
                    }
                    
                    embeddings.push(embedding);
                  } catch (error) {
                    console.error('Error generating embedding:', error);
                    // Push an empty array to maintain the same array length as input
                    embeddings.push([]);
                  }
                }
                return embeddings;
              },
              embedQuery: async (text: string): Promise<number[]> => {
                try {
                  const response = await hf.featureExtraction({
                    model: 'sentence-transformers/all-MiniLM-L6-v2',
                    inputs: text,
                  });
                  
                  // Handle different possible response types
                  if (Array.isArray(response)) {
                    // If it's already a flat array of numbers, return it
                    if (response.every(item => typeof item === 'number')) {
                      return response as number[];
                    }
                    // If it's an array of arrays (e.g., for batch processing), take the first one
                    if (Array.isArray(response[0])) {
                      return response[0] as number[];
                    }
                  }
                  // If response is a single number, wrap it in an array
                  return typeof response === 'number' ? [response] : [];
                } catch (error) {
                  console.error('Error generating query embedding:', error);
                  return [];
                }
              },
            },
            dbConfig
          );

          console.log("Performing text search (vector search disabled)...");
          const textResults = await collection
            .find({
              $and: [
                {
                  $or: [
                    { user_id: { $regex: query, $options: "i" } },
                    { patient_code: { $regex: query, $options: "i" } },
                    { emergency_contact: { $regex: query, $options: "i" } },
                    { is_active: { $regex: query, $options: "i" } },
                    { created_by: { $regex: query, $options: "i" } },
                    { updated_by: { $regex: query, $options: "i" } },
                  ]
                },
                { is_deleted: { $ne: true } }  // Filter out deleted records
              ]
            })
            .limit(n)
            .toArray();

            console.log(`Text search returned ${textResults.length} results`);
            const textResult: ItemLookupResult = {
              results: textResults,
              searchType: "text",
              query: query,
              count: textResults.length,
            };
            return JSON.stringify(textResult);
          

          // const vectorResult: ItemLookupResult = {
          //   results: result,
          //   searchType: "vector",
          //   query: query,
          //   count: result.length,
          // };
          // return JSON.stringify(vectorResult);
        } catch (error: any) {
          console.error("Error in item lookup:", error);
          console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
          });

          const errorResult: ItemLookupError = {
            error: "Failed to search inventory",
            details: error.message,
            query: query,
          };
          return JSON.stringify(errorResult);
        }
      },
      {
        name: "item_lookup",
        description:
          "Gathers patient details from the Patient database",
        schema: z.object({
          query: z.string().describe("The search query"),
          n: z
            .number()
            .optional()
            .default(10)
            .describe("Number of results to return"),
        }),
      }
    );

    const tools = [itemLookupTool];
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
            `You are a helpful E-commerce Chatbot Agent for a healthcare system. 

IMPORTANT: You have access to an item_lookup tool that searches the patient database. ALWAYS use this tool when customers ask about patient information, even if the tool returns errors or empty results.

When using the item_lookup tool:
- If it returns results, provide helpful details about the patient
- If it returns an error or no results, acknowledge this and offer to help in other ways
- If the database appears to be empty, let the customer know that patient database might be being updated

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

    // Extract the final response with type safety
    if (!finalState?.messages?.length) {
      throw new Error("No messages found in the conversation state");
    }

    const lastMessage = finalState.messages[finalState.messages.length - 1];
    const response = lastMessage?.content;

    if (!response) {
      throw new Error("No content in the last message");
    }

    console.log("Agent response:", response);
    return response;
  } catch (error: any) {
    console.error("Error in callAgent:", error.message);

    if (error.status === 429) {
      throw new Error(
        "Service temporarily unavailable due to rate limits. Please try again in a minute."
      );
    } else if (error.status === 401) {
      throw new Error(
        "Authentication failed. Please check your API configuration."
      );
    } else {
      throw new Error(`Agent failed: ${error.message}`);
    }
  }
}
