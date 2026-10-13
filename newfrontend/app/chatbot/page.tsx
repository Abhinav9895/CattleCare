'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Loader2, Info } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Section } from '@/components/section';
import { Card } from '@/components/card-base';
import { API_BASE_URL } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatBot() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /* START WITH FRESH CHAT EVERY TIME PAGE LOADS */

  useEffect(() => {

    setMessages([
      {
        id: '1',
        role: 'assistant',
        content:
          "Hello! I'm your AI Veterinary Assistant. Ask me anything about cattle diseases, vaccination, pregnancy, feeding, and livestock health.",
        timestamp: new Date(),
      },
    ]);

  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!input.trim()) return;

    const userText = input;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {

      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText
        }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "AI returned an empty response.",
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];

      setMessages(finalMessages);

    } catch (error) {

      console.error("Chat error:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Error connecting to AI assistant.",
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, errorMessage];

      setMessages(finalMessages);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <Navbar />

      {/* Hero */}

      <section className="chatbot-bg relative h-[250px] flex items-center justify-center text-white">

        <div className="text-center space-y-3 px-4">

          <MessageCircle className="w-14 h-14 mx-auto" />

          <h1 className="text-4xl font-bold">
            AI Veterinary Assistant
          </h1>

          <p className="text-lg">
            Chat with our intelligent veterinary advisor
          </p>

        </div>

      </section>

      <Section className="flex-1 flex flex-col py-6">

        <div className="max-w-2xl mx-auto w-full flex flex-col h-[600px] gap-6">

          {/* Chat Messages */}

          <Card className="flex-1 overflow-y-auto space-y-4 p-6">

            {messages.map((message) => (

              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >

                <div
                  className={`max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >

                  <p className="text-sm">{message.content}</p>

                  <span className="text-xs opacity-70 block mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                </div>

              </div>

            ))}

            {isLoading && (
              <div className="flex gap-2 items-center">
                <Loader2 className="animate-spin w-4 h-4" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />

          </Card>

          {/* Input */}

          <form onSubmit={handleSendMessage} className="flex gap-2">

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cattle diseases, vaccination, pregnancy..."
              disabled={isLoading}
              className="flex-1 border rounded-lg px-4 py-2"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Send size={18} />
            </button>

          </form>

          {/* Disclaimer */}

          <Card className="bg-blue-50 border border-blue-200">

            <div className="flex gap-2">

              <Info className="w-4 h-4 text-blue-600 mt-1" />

              <p className="text-xs">
                This AI assistant provides general guidance only.
                Always consult a veterinarian for diagnosis and treatment.
              </p>

            </div>

          </Card>

        </div>

      </Section>

    </div>
  );
}
