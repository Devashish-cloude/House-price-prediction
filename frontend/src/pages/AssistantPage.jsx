import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, User, RefreshCw, Sliders, 
  HelpCircle, Building2, TrendingUp, Lightbulb, CheckCircle2 
} from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import apiService from '../services/api';
import { formatPrice } from '../utils/formatters';
import { TypingIndicator } from '../components/LoadingSkeleton';

export default function AssistantPage() {
  const { currentPrediction, formData } = usePrediction();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your **PropertyAI Assistant** powered by HouseAI's machine learning engine.\n\nI have context on your currently selected property in **${formData.locality || 'Manish Nagar'}, ${formData.city || 'Nagpur'}** (${formData.bhk} BHK, ${formData.area} sq.ft).\n\nFeel free to ask me questions about your valuation, what-if scenarios, or how to enhance market appeal!`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "Why is my property valued at this price?",
    "What if my property was 1500 sq.ft?",
    "Which feature affects my valuation the most?",
    "How can I increase my property's market value?",
    "What if I convert it to Fully Furnished?",
    "What is the impact of dedicated parking?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await apiService.sendChatMessage(text, formData, historyPayload);
      
      const assistantMsg = {
        role: 'assistant',
        content: response.reply,
        counterfactual: response.counterfactual_prediction,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue communicating with the AI service. Please verify that the backend server is running.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>PropertyAI Assistant</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                Online
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Conversational Explainable AI • Real-Time Counterfactuals • Valuation Advice
            </p>
          </div>
        </div>

        {/* Current Active Context Badge */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-300 flex items-center space-x-2">
          <Building2 className="w-3.5 h-3.5 text-teal-500" />
          <span className="font-semibold">{formData.locality}, {formData.city}</span>
          <span className="text-slate-400">•</span>
          <span>{formData.bhk} BHK</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 min-h-[480px] max-h-[560px] flex flex-col justify-between shadow-xl border border-teal-500/20">
        
        {/* Scrollable Message History */}
        <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs shadow-sm ${
                  isUser 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-gradient-to-tr from-teal-500 to-emerald-400 text-white'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                    : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/5'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* If assistant returned a counterfactual card */}
                  {msg.counterfactual && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-teal-500/30 text-white space-y-1.5 font-mono text-[11px]">
                      <div className="flex items-center justify-between font-bold text-teal-400">
                        <span>Counterfactual Shift:</span>
                        <span>{msg.counterfactual.price_diff_formatted} ({msg.counterfactual.percentage_change >= 0 ? '+' : ''}{msg.counterfactual.percentage_change}%)</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-300">
                        <span>Original: {msg.counterfactual.original_price_formatted}</span>
                        <span>Simulated: {msg.counterfactual.new_price_formatted}</span>
                      </div>
                    </div>
                  )}

                  <span className={`text-[9px] block text-right mt-1 ${isUser ? 'text-teal-200' : 'text-slate-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <TypingIndicator />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-semibold">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Suggested Inquiries</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200 dark:border-white/5 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="relative flex items-center pt-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your property valuation, what-if changes, or improvement ideas..."
              className="w-full glass-input rounded-2xl pl-4 pr-12 py-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-sm"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              className="absolute right-2 p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-40 transition-all shadow-md shadow-teal-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
