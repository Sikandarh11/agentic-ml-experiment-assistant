import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, ChatSession, AgentMode } from '@/types/agent';
import { runBackendAgent } from '@/lib/agent-api';
import { ChatBubble } from '@/components/ChatBubble';
import { AgentGraph } from '@/components/AgentGraph';
import { TracePanel } from '@/components/TracePanel';
import { Button } from '@/components/ui/button';
import { Send, Trash2, Download, Plus, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

function getInitialAgent(mode: AgentMode): string {
  return mode === 'single' ? 'Weather Agent' : 'Triage Agent';
}

function newSession(mode: AgentMode): ChatSession {
  return {
    id: `sess-${Date.now()}`,
    mode,
    messages: [],
    createdAt: Date.now(),
    activeAgent: getInitialAgent(mode),
  };
}

function withoutToolMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter((m) => m.role !== 'tool');
}

export default function StudioPage() {
  const [mode, setMode] = useState<AgentMode>('single');
  const [session, setSession] = useState<ChatSession>(() => newSession('single'));
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages]);

  const switchMode = useCallback((m: AgentMode) => {
    setMode(m);
    setSession(newSession(m));
  }, []);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      ts: Date.now(),
    };

    const outboundMessages = [...session.messages, userMsg];
    setSession(prev => ({ ...prev, messages: [...prev.messages, userMsg] }));
    setInput('');
    setIsTyping(true);
    setBackendError(null);

    try {
      const result = await runBackendAgent(mode, outboundMessages, 6);
      setSession(prev => ({
        ...prev,
        messages: [...prev.messages, ...withoutToolMessages(result.messages)],
        activeAgent: result.activeAgent,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown backend error';
      setBackendError(message);
      setSession(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: `msg-${Date.now()}-backend-error`,
            role: 'assistant',
            sender: 'System',
            content: 'Backend is unavailable right now. Please check server status and try again.',
            ts: Date.now(),
          },
        ],
      }));
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, mode, session.activeAgent, session.messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${session.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-neon font-mono font-bold text-sm hover:opacity-80 transition">← Back</a>
          <span className="text-muted-foreground text-xs font-mono">/ demo studio</span>
          {backendError && (
            <span className="text-[10px] font-mono text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded">
              backend unavailable
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-neon" />
          <span className="text-xs font-mono text-foreground">
            Active: <span className="text-neon font-semibold">{session.activeAgent}</span>
          </span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-53px)]">
        {/* Left: Chat */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-border">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {withoutToolMessages(session.messages).length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <div className="text-3xl">🤖</div>
                <p className="text-muted-foreground text-sm font-mono">
                  {mode === 'single'
                    ? 'Ask the Weather Agent about weather or send emails'
                    : 'Talk to the Triage Agent — it routes to Sales or Refunds'}
                </p>
              </div>
            )}
            {withoutToolMessages(session.messages).map(msg => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-1 px-4 py-2"
              >
                <span className="w-2 h-2 rounded-full bg-neon animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-neon animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-neon animate-bounce" style={{ animationDelay: '300ms' }} />
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Composer */}
          <div className="border-t border-border p-3">
            <div className="flex gap-2 items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={mode === 'single' ? 'Ask about the weather...' : 'Ask about products, refunds...'}
                rows={1}
                className="flex-1 resize-none rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                size="sm"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="w-full lg:w-[380px] overflow-y-auto p-4 space-y-5 bg-surface-elevated">
          {/* Mode selector */}
          <div>
            <h3 className="text-xs font-mono font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Mode</h3>
            <div className="flex gap-2">
              <button
                onClick={() => switchMode('single')}
                className={`flex-1 px-3 py-2 rounded border text-xs font-mono font-semibold transition-all ${
                  mode === 'single'
                    ? 'border-neon text-neon glow-neon bg-secondary'
                    : 'border-border text-muted-foreground bg-card hover:border-muted-foreground'
                }`}
              >
                Single Agent
              </button>
              <button
                onClick={() => switchMode('multi')}
                className={`flex-1 px-3 py-2 rounded border text-xs font-mono font-semibold transition-all ${
                  mode === 'multi'
                    ? 'border-neon text-neon glow-neon bg-secondary'
                    : 'border-border text-muted-foreground bg-card hover:border-muted-foreground'
                }`}
              >
                Multi-Agent
              </button>
            </div>
          </div>

          {/* Agent Graph */}
          <div>
            <h3 className="text-xs font-mono font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Agent Graph</h3>
            <div className="border border-border rounded-lg bg-card p-2">
              <AgentGraph mode={mode} activeAgent={session.activeAgent} />
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-xs font-mono font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setSession(newSession(mode))} className="font-mono text-xs">
                <Plus className="h-3 w-3 mr-1" /> New Session
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSession(prev => ({ ...prev, messages: [] }))} className="font-mono text-xs">
                <Trash2 className="h-3 w-3 mr-1" /> Clear
              </Button>
              <Button variant="outline" size="sm" onClick={exportJSON} className="font-mono text-xs">
                <Download className="h-3 w-3 mr-1" /> Export JSON
              </Button>
            </div>
          </div>

          {/* Trace */}
          <div>
            <h3 className="text-xs font-mono font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Trace</h3>
            <div className="border border-border rounded-lg bg-card p-3">
              <TracePanel messages={withoutToolMessages(session.messages)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
