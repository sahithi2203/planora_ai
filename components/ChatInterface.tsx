import React, { useState, useRef, useEffect } from 'react';
import { Mode, Message } from '../types';
import { MODE_CONFIG } from '../constants';
import { generateItinerary, findPlaces, researchTopic } from '../services/geminiService';
import PlanRenderer from './PlanRenderer';
import GroundingResults from './GroundingResults';
import { SendIcon, SparklesIcon, RefreshIcon } from './Icons';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  currentMode: Mode;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentMode }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<{ lat: number; lng: number } | undefined>(undefined);

  // Initialize location permission
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          locationRef.current = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
        },
        (err) => console.log('Location access denied, maps features may be limited', err)
      );
    }
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      type: 'text',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (currentMode === Mode.PLAN) {
        const itinerary = await generateItinerary(input);
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          type: 'itinerary',
          itineraryData: itinerary,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, botMsg]);
      } else if (currentMode === Mode.EXPLORE) {
        const { text, chunks } = await findPlaces(input, locationRef.current);
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: text,
          type: 'map_results',
          groundingData: chunks,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        // RESEARCH
        const { text, chunks } = await researchTopic(input);
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: text,
          type: 'text',
          groundingData: chunks,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "I encountered an error while processing your request. Please try again.",
        type: 'text',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.type === 'itinerary' && msg.itineraryData) {
      return <PlanRenderer itinerary={msg.itineraryData} />;
    }

    return (
      <div className="space-y-4">
        {msg.content && (
          <div className={`prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 max-w-none ${msg.role === 'user' ? 'text-white' : ''}`}>
             <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        )}
        {msg.type === 'map_results' && msg.groundingData && (
          <GroundingResults chunks={msg.groundingData} type="map" />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[600px] glass-card rounded-2xl border border-white/10 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.length === 0 && (
           <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 opacity-50">
              <SparklesIcon className="w-12 h-12 mb-2" />
              <p>Start a conversation with Planora</p>
           </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[85%] p-4 rounded-2xl ${
               msg.role === 'user' 
               ? 'bg-violet-600 text-white rounded-br-none' 
               : 'bg-slate-800 border border-slate-700 rounded-bl-none'
             }`}>
                {renderMessageContent(msg)}
             </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
              <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-700 flex gap-1">
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                 <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
              </div>
           </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-900/50 border-t border-white/5">
         <div className="relative">
            <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder={MODE_CONFIG[currentMode].description}
               className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
            />
            <button 
               type="submit" 
               disabled={!input.trim() || isLoading}
               className="absolute right-2 top-2 p-1.5 bg-violet-600 rounded-lg text-white disabled:opacity-50 hover:bg-violet-500 transition-colors"
            >
               {isLoading ? <RefreshIcon className="animate-spin w-5 h-5" /> : <SendIcon />}
            </button>
         </div>
      </form>
    </div>
  );
};

export default ChatInterface;