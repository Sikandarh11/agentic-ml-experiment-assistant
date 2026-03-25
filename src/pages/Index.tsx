import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, GitBranch, Wrench, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'Single Agent',
    description: 'A Weather Agent with tool calling — get forecasts and send emails via function calls.',
  },
  {
    icon: GitBranch,
    title: 'Multi-Agent Handoff',
    description: 'Triage → Sales / Refunds routing with automatic agent handoffs and transfer-back.',
  },
  {
    icon: Wrench,
    title: 'Tool Calling',
    description: 'Functions registered as tools: get_weather, send_email, process_refund, apply_discount.',
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary text-xs font-mono text-muted-foreground mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Agent Orchestration Framework
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Agentic ML<br />
            <span className="text-neon">Experiment Assistant</span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg mb-8 font-mono leading-relaxed">
            Lightweight agent framework with orchestration, tool calling, and multi-agent handoffs. 
            Interactive demo studio included.
          </p>

          <Button
            onClick={() => navigate('/studio')}
            size="lg"
            className="font-mono font-semibold text-sm gap-2"
          >
            Open Demo Studio <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 max-w-4xl w-full">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="rounded-lg border border-border bg-card p-5 text-left hover:border-neon transition-colors group"
            >
              <f.icon className="h-5 w-5 text-neon mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-semibold text-foreground mb-1 font-mono">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground font-mono">
        Demo Studio · Agent Framework · Portfolio Project
      </footer>
    </div>
  );
}
