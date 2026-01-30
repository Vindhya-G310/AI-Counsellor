import React, { useState, useRef, useEffect } from "react";
import { counsellorAPI } from "../services/api";

export const Counsellor = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I am your AI Counselor. I have analyzed your profile and am ready to provide personalized guidance for your study abroad journey. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGetCounseling = async () => {
    setLoading(true);
    try {
      const response = await counsellorAPI.analyze();
      const data = response.data;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() - 1,
          text: "🔍 Analyzing your profile...",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);

      const counselMessage = {
        id: Date.now(),
        text: data.message,
        sender: "ai",
        timestamp: new Date(),
        strengths: data.strengths || [],
        gaps: data.gaps || [],
        recommendations: data.recommendations || [],
        actions: data.actions || [],
      };

      setMessages((prev) => [...prev, counselMessage]);
    } catch (err) {
      console.error("Failed to get counseling", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "❌ Sorry, I encountered an error. Please try again.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">AI Counsellor</h1>
          <p className="text-gray-600">
            Get personalized guidance for your study abroad journey
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 py-8 flex-1 flex flex-col">
        <div className="bg-white rounded-lg shadow flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-2xl ${
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-800"
                  } rounded-lg p-4`}
                >
                  <p className="mb-2">{message.text}</p>

                  {message.strengths && (
                    <div className="mt-4 space-y-4">
                      <div className="bg-white bg-opacity-20 rounded p-3">
                        <h4 className="font-semibold mb-2">Your Strengths:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {message.strengths.map((strength, idx) => (
                            <li key={idx}>{strength}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white bg-opacity-20 rounded p-3">
                        <h4 className="font-semibold mb-2">
                          Areas to Improve:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {message.gaps.map((gap, idx) => (
                            <li key={idx}>{gap}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white bg-opacity-20 rounded p-3">
                        <h4 className="font-semibold mb-2">Recommendations:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {message.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>

                      {message.actions && message.actions.length > 0 && (
                        <div className="bg-success bg-opacity-20 rounded p-3">
                          <h4 className="font-semibold mb-2">
                            ✅ {message.actions.length} Task(s) Created
                          </h4>
                          <p className="text-sm">
                            Tasks have been added to your application guidance.
                            Check the Applications page to view them.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-6 bg-gray-50">
            <button
              onClick={handleGetCounseling}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Analyzing your profile..." : "🤖 Get AI Counseling"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
