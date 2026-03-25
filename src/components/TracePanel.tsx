import { ChatMessage } from '@/types/agent';
import { motion } from 'framer-motion';

interface TracePanelProps {
  messages: ChatMessage[];
}

export function TracePanel({ messages }: TracePanelProps) {
  if (messages.length === 0) {
    return (
      <div className="text-xs text-muted-foreground font-mono py-4 text-center">
        No events yet. Start chatting to see the trace.
      </div>
    );
  }

  const events: { type: 'response' | 'tool' | 'handoff'; label: string; detail: string; ts: number }[] = [];
  let lastSender = '';

  for (const msg of messages) {
    if (msg.role === 'assistant') {
      if (msg.sender && msg.sender !== lastSender && lastSender !== '') {
        events.push({ type: 'handoff', label: `Handoff → ${msg.sender}`, detail: `from ${lastSender}`, ts: msg.ts });
      }
      events.push({ type: 'response', label: msg.sender || 'Assistant', detail: msg.content.slice(0, 80) + (msg.content.length > 80 ? '…' : ''), ts: msg.ts });
      if (msg.sender) lastSender = msg.sender;
    } else if (msg.role === 'tool') {
      events.push({ type: 'tool', label: msg.tool_name || 'tool', detail: msg.content.slice(0, 60), ts: msg.ts });
    }
  }

  return (
    <div className="space-y-1 max-h-[400px] overflow-y-auto">
      {events.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          className="flex items-start gap-2 text-xs font-mono py-1.5 border-l-2 pl-3"
          style={{
            borderColor:
              e.type === 'handoff' ? 'hsl(var(--accent-purple))' :
              e.type === 'tool' ? 'hsl(var(--tool-border))' :
              'hsl(var(--border))',
          }}
        >
          <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
            e.type === 'handoff' ? 'bg-accent text-accent-foreground' :
            e.type === 'tool' ? 'text-neon' :
            'text-muted-foreground'
          }`}>
            {e.type === 'handoff' ? '↗ HANDOFF' : e.type === 'tool' ? '⚙ TOOL' : '💬 RESP'}
          </span>
          <div className="min-w-0">
            <div className="font-semibold text-foreground">{e.label}</div>
            <div className="text-muted-foreground truncate">{e.detail}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
