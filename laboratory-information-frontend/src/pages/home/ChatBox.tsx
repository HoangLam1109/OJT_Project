import { useState } from "react";
import Button from "@/components/common/button";
import { Card } from "@/components/common/card";
import { MessageCircle, X, Send } from "lucide-react";
import { Textarea } from "@/components/common/textarea";
import { sendMessage, continueChat } from "@/service/chatBoxService";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Chúng tôi có thể giúp gì cho bạn?", sender: "bot" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    const messageText = inputMessage.trim();
    if (!messageText || isLoading) return;

    // Add user message to UI
    const userMessage = { 
      id: messages.length + 1, 
      text: messageText, 
      sender: "user" as const 
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      let response;
      
      // Use continueChat if we have a threadId, otherwise start a new conversation
      if (threadId) {
        response = await continueChat(threadId, messageText);
      } else {
        response = await sendMessage(messageText);
        // Save threadId for future messages
        if (response.data?.threadId) {
          setThreadId(response.data.threadId);
        }
      }

      // Add bot response to UI
      if (response.data?.response) {
        setMessages(prev => [...prev, { 
          id: prev.length + 1, 
          text: response.data.response, 
          sender: "bot" as const 
        }]);
      }

      // Update threadId if it changed (shouldn't happen, but just in case)
      if (response.data?.threadId && response.data.threadId !== threadId) {
        setThreadId(response.data.threadId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Show error message to user
      setMessages(prev => [...prev, { 
        id: prev.length + 1, 
        text: "Xin lỗi, có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.", 
        sender: "bot" as const 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-[100] bg-white text-primary hover:bg-white hover:text-primary"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-elegant z-[100] flex flex-col bg-gradient-to-b from-primary to-primary/30 p-0 rounded-none overflow-hidden gap-0">


          {/* Header */}
          <div className="bg-gradient-to-r from-[#007BFF] via-[#0056CC] to-[#004199] p-4 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Hỗ trợ trực tuyến</h3>
                <p className="text-xs text-white/80">Trực tuyến</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-white p-2 space-y-2">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted text-foreground">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">Thinking...</span>
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1 h-1 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1 h-1 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Nhập tin nhắn..."
                className="flex-1 min-h-[44px] max-h-[100px] resize-none bg-white"
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon" 
                className="shrink-0"
                disabled={isLoading || !inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatBox;
