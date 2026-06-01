"use client";
import { useState, useRef, useEffect } from "react";
 
interface Message {
  role: "user" | "assistant";
  content: string;
}
 
export default function ChatBot({ careerData }: { careerData?: any }) {
  const [open, setOpen] = useState(false);
  const [resolvedData, setResolvedData] = useState<any>(careerData || null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm your AI Career Advisor 👋 Ask me anything about your career, skills, salary, or job market!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    if (!resolvedData) {
      const stored = localStorage.getItem("careerData");
      if (stored) setResolvedData(JSON.parse(stored));
    }
  }, []);
 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
 
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
 
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
 
    try {
      const res = await fetch("https://careergps-backend-4sl3.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          career_data: resolvedData || {},
          history: messages,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, backend se connect nahi ho paya. Make sure it's running!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-gray-100 transition"
      >
        {open ? "✕" : "🤖"}
      </button>
 
      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-black border border-white/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          style={{ height: "500px" }}
        >
          {/* HEADER */}
          <div className="p-4 border-b border-white/10 bg-white/5 shrink-0">
            <p className="text-white font-bold text-sm">🤖 AI Career Advisor</p>
            <p className="text-green-400 text-xs">● Online {resolvedData ? "· Profile loaded" : ""}</p>
          </div>
 
          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-white text-black rounded-br-sm"
                      : "bg-white/10 text-gray-200 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
 
            {/* TYPING INDICATOR */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
 
          {/* INPUT */}
          <div className="p-3 border-t border-white/10 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about your career..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-3 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-100 transition disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}