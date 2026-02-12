import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChatMessage, CurriculumData } from '../types';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";

interface AdvisorProps {
    curriculumData: CurriculumData | null;
}

export const Advisor: React.FC<AdvisorProps> = ({ curriculumData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: "Hello! I'm your AI Academic Advisor. I have analyzed your curriculum. How can I help refine it? You can ask me to expand on specific courses or suggest changes.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  useEffect(() => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let systemInstruction = `You are Planora's intelligent AI Academic Advisor. 
        Your role is to assist users in designing educational curriculums.
        Tone: Professional, encouraging, futuristic, and concise.`;

        if (curriculumData) {
            systemInstruction += `
            
            CONTEXT:
            The user has currently generated a curriculum titled "${curriculumData.title}".
            Here is the summary of the generated curriculum:
            - Program Type: ${curriculumData.programType}
            - Role: ${curriculumData.role}
            - Semesters: ${curriculumData.semesters.length}
            
            Structure JSON (reference this for specific questions):
            ${JSON.stringify(curriculumData.semesters.map(s => ({
                semester: s.title,
                courses: s.courses.map(c => ({
                    code: c.code,
                    title: c.title,
                    topics: c.topics,
                    objectives: c.learningObjectives
                }))
            })))}
            
            If the user asks about a specific semester or course, look it up in this data.`;
        } else {
            systemInstruction += ` No curriculum has been generated yet. Guide the user to the Generator tab.`;
        }

        chatSessionRef.current = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: systemInstruction
            }
        });
    } catch (e) {
        console.error("Error initializing AI:", e);
    }
  }, [curriculumData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userText = input;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: userText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      if (!chatSessionRef.current) {
           const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
           chatSessionRef.current = ai.chats.create({ model: 'gemini-3-flash-preview' });
      }

      const result = await chatSessionRef.current.sendMessage({ message: userText });
      const responseText = result.text;

      const aiMsg: ChatMessage = { 
          id: (Date.now() + 1).toString(), 
          role: 'ai', 
          content: responseText || "I couldn't generate a response. Please try again.", 
          timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Generation Error:", error);
      const errorMsg: ChatMessage = { 
          id: (Date.now() + 1).toString(), 
          role: 'ai', 
          content: "I'm having trouble connecting to the neural network right now. Please check your connection or API key.", 
          timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col glass-card rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center border border-violet-500/30">
            <Bot className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Planora AI Advisor</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
            </p>
          </div>
        </div>
        <Sparkles className="text-slate-600 w-5 h-5" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
              ? 'bg-violet-600 text-white rounded-br-none' 
              : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
            }`}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                 {msg.content}
              </div>
              <span className="text-[10px] opacity-50 block mt-2 text-right">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-700 flex gap-1">
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></span>
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-white/5">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
            placeholder="Ask to modify your curriculum..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 p-1.5 bg-violet-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-500 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};