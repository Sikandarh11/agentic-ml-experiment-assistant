import { ChatMessage } from '@/types/agent';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const [toolOpen, setToolOpen] = useState(false);

  if (message.role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[75%] rounded-lg bg-primary px-4 py-2.5 text-primary-foreground text-sm">
          {message.content}
        </div>
      </motion.div>
    );
  }

  if (message.role === 'tool') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start"
      >
        <div
          className="max-w-[85%] rounded-md border px-3 py-2 text-xs font-mono cursor-pointer"
          style={{
            background: 'hsl(var(--tool-bg))',
            borderColor: 'hsl(var(--tool-border))',
            color: 'hsl(var(--tool-text))',
          }}
          onClick={() => setToolOpen(!toolOpen)}
        >
          <div className="flex items-center gap-1.5">
            {toolOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            <span className="font-semibold">⚙ {message.tool_name}</span>
          </div>
          {toolOpen && (
            <div className="mt-2 space-y-1 text-xs opacity-80">
              {message.tool_args && (
                <div>
                  <span className="text-muted-foreground">args: </span>
                  {JSON.stringify(message.tool_args)}
                </div>
              )}
              <div>
                <span className="text-muted-foreground">result: </span>
                {message.content}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // assistant
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start gap-2"
    >
      <div className="max-w-[85%]">
        {message.sender && (
          <span className="inline-block mb-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-secondary text-neon border border-border">
            {message.sender}
          </span>
        )}
        <div className="rounded-lg bg-card border border-border px-4 py-2.5 text-sm text-card-foreground">
          {message.content}
        </div>
      </div>
    </motion.div>
  );
}
