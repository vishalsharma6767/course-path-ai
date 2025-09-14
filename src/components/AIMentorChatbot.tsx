import React, { useState } from "react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const currentMessage = inputMessage;

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: currentMessage, isBot: false, timestamp: new Date() },
    ]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Call Supabase Function endpoint instead of OpenAI
      const response = await fetch("https://YOUR_SUPABASE_URL/functions/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      const data = await response.text(); // Supabase function returns plain text
      console.log("AI Raw Response:", data);

      const aiReply = data || "⚠️ No response from AI";

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: aiReply, isBot: true, timestamp: new Date() },
      ]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 2).toString(), text: "⚠️ Failed to connect to AI.", isBot: true, timestamp: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100 p-4">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 p-2 border rounded bg-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg max-w-[70%] ${
              msg.isBot ? "bg-blue-100 self-start" : "bg-green-100 self-end"
            }`}
          >
            <p>{msg.text}</p>
            <span className="text-xs text-gray-500 block">
              {msg.timestamp.toLocaleTimeString()}
            </span>
          </div>
        ))}
        {isTyping && <p className="text-sm text-gray-500">🤖 Typing...</p>}
      </div>

      {/* Input */}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          placeholder="Ask me anything..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

