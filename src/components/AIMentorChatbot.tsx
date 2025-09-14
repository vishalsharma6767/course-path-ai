"use client";
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

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: currentMessage, isBot: false, timestamp: new Date() },
    ]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMessage }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");

      // Add AI reply
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: data.reply, isBot: true, timestamp: new Date() },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 2).toString(), text: "⚠️ Sorry, I couldn’t get an answer.", isBot: true, timestamp: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100 p-4">
      {/* Chat window */}
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
