import { AgentMode } from '@/types/agent';
import { motion } from 'framer-motion';

interface AgentGraphProps {
  mode: AgentMode;
  activeAgent: string;
}

function Node({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={`px-3 py-2 rounded border text-xs font-mono font-semibold text-center transition-all duration-300 ${
        active
          ? 'border-neon text-neon glow-neon bg-secondary'
          : 'border-border text-muted-foreground bg-card'
      }`}
    >
      {label}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center">
      <svg width="24" height="12" viewBox="0 0 24 12" className="text-muted-foreground">
        <line x1="0" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="18,2 24,6 18,10" fill="currentColor" />
      </svg>
    </div>
  );
}

export function AgentGraph({ mode, activeAgent }: AgentGraphProps) {
  if (mode === 'single') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 justify-center py-4"
      >
        <Node label="Goal" active={false} />
        <Arrow />
        <Node label="Weather Agent" active={activeAgent === 'Weather Agent'} />
        <Arrow />
        <div className="flex flex-col gap-1">
          <div className="text-[10px] font-mono text-muted-foreground px-2 py-1 bg-card rounded border border-border">get_weather</div>
          <div className="text-[10px] font-mono text-muted-foreground px-2 py-1 bg-card rounded border border-border">send_email</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-4 space-y-3"
    >
      <div className="flex items-center gap-2 justify-center">
        <Node label="Triage" active={activeAgent === 'Triage Agent'} />
        <Arrow />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Node label="Sales Agent" active={activeAgent === 'Sales Agent'} />
          </div>
          <div className="flex items-center gap-2">
            <Node label="Refunds Agent" active={activeAgent === 'Refunds Agent'} />
            <Arrow />
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-mono text-muted-foreground px-2 py-1 bg-card rounded border border-border">process_refund</div>
              <div className="text-[10px] font-mono text-muted-foreground px-2 py-1 bg-card rounded border border-border">apply_discount</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-[10px] text-center text-muted-foreground font-mono">
        ← agents can transfer back to triage →
      </div>
    </motion.div>
  );
}
