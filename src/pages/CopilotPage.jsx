import React, { useState, useRef, useEffect } from 'react'
import { MessageSquareWarning, Send, User, Bot, Loader2, FileText, AlertTriangle } from 'lucide-react'

export function CopilotPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Good evening, Commissioner. I am your AI Operations Copilot. I have analyzed today\'s risk reports and budget allocations. How can I assist you in optimizing city safety today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response Logic
    setTimeout(() => {
      let aiResponse = "Based on current data, our priority should be Ward 18. The correlation engine indicates a 68% risk of incidents if the 54 street light defects are not resolved immediately.";
      
      if (userMsg.toLowerCase().includes('budget')) {
         aiResponse = "We currently have ₹10.5L remaining in this month's electrical maintenance budget. Deploying all 3 teams today will consume ₹4.5L, leaving a safe 40% buffer for emergency operations.";
      } else if (userMsg.toLowerCase().includes('police') || userMsg.toLowerCase().includes('patrol')) {
         aiResponse = "I have cross-referenced the electrical failures with police patrol routes. Patrol P3 is currently covering Ward 18 at 82% efficiency, but they are requesting immediate lighting repairs near the Women's College sector.";
      } else if (userMsg.toLowerCase().includes('report')) {
         aiResponse = "I have generated a summarized brief of the 'Ward Performance Matrix'. Would you like me to export this to your dashboard as a PDF?";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-4 overflow-hidden bg-base text-foreground font-sans">
      <div className="shrink-0 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight flex items-center gap-2">
            <MessageSquareWarning /> Commissioner Copilot
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Executive AI Assistant connected to live city telemetry and operations data.</p>
        </div>
      </div>

      <div className="flex-1 bg-surface border border-border shadow-sm rounded-xl flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${msg.role === 'assistant' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-secondary border-border text-foreground'}`}>
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'assistant' 
                  ? 'bg-secondary/30 border border-border text-foreground rounded-tl-none' 
                  : 'bg-primary text-primary-foreground rounded-tr-none shadow-sm'
              }`}>
                {msg.content}
                
                {/* Simulated UI attachments in AI responses */}
                {msg.role === 'assistant' && msg.content.includes('Ward 18') && !msg.content.includes('budget') && !msg.content.includes('police') && (
                  <div className="mt-4 bg-base border border-border rounded-lg p-3 flex items-center gap-3">
                    <div className="bg-destructive/10 p-2 rounded text-destructive"><AlertTriangle size={16} /></div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Action Required: Ward 18 Deployment</p>
                      <p className="text-[10px] text-muted-foreground">Reference: Electrical Operations Dashboard</p>
                    </div>
                  </div>
                )}
                {msg.role === 'assistant' && msg.content.includes('export') && (
                  <div className="mt-4 bg-base border border-border rounded-lg p-3 flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded text-primary"><FileText size={16} /></div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Ward Performance Matrix.pdf</p>
                      <p className="text-[10px] text-muted-foreground">Ready for download</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
             <div className="flex gap-4 max-w-[85%]">
               <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border bg-primary/10 border-primary/30 text-primary">
                 <Bot size={20} />
               </div>
               <div className="p-4 rounded-2xl rounded-tl-none bg-secondary/30 border border-border text-foreground flex items-center gap-2 h-[52px]">
                 <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                 <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-secondary/10 shrink-0">
          <form onSubmit={handleSend} className="flex gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about budget, police patrols, or high-risk wards..." 
              className="flex-1 bg-base border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              disabled={isTyping}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={18} /> Send
            </button>
          </form>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
             <button type="button" onClick={() => setInput("What is the current budget status?")} className="shrink-0 bg-base border border-border px-3 py-1.5 rounded-full text-[10px] font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors">What is the current budget status?</button>
             <button type="button" onClick={() => setInput("Are police patrols aligned with electrical failures?")} className="shrink-0 bg-base border border-border px-3 py-1.5 rounded-full text-[10px] font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors">Are police patrols aligned?</button>
             <button type="button" onClick={() => setInput("Generate a report on Ward performance.")} className="shrink-0 bg-base border border-border px-3 py-1.5 rounded-full text-[10px] font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors">Generate Ward report</button>
          </div>
        </div>
      </div>
    </div>
  )
}
