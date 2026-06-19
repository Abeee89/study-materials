"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Hi student! I'm your Basic Electricity AI assistant. What would you like to learn today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if(!input.trim()) return;
    const currentInput = input.trim();
    
    // Pushing user msg
    const newMessages = [...messages, { role: 'user' as const, content: currentInput }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: window.location.pathname
        })
      });

      const data = await response.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I had trouble processing that request." }]);
      }
    } catch (error) {
       console.error("Chat Error:", error);
       setMessages(prev => [...prev, { role: 'ai', content: "Network error occurred." }]);
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-500 transition-colors z-50 focus:outline-none"
      >
        <MessageCircle className="text-white w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl z-50 flex flex-col"
            style={{ maxHeight: 'calc(100vh - 120px)', height: '500px' }}
          >
            {/* Header */}
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                 <span className="font-semibold text-white">AI Assistant</span>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                 <X className="w-5 h-5" />
               </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex justify-start">
                   <div className="p-3 bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl rounded-bl-sm text-sm">
                     <span className="flex gap-1">
                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                     </span>
                   </div>
                 </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
               <input 
                 type="text" 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Ask about electricity..."
                 className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
               />
               <button 
                 onClick={handleSend}
                 className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-colors"
               >
                 <Send className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
