export type ChatRole = 'user' | 'assistant' | 'tool';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  sender?: string;
  tool_name?: string;
  tool_call_id?: string;
  tool_args?: Record<string, unknown>;
  ts: number;
}

export interface ChatSession {
  id: string;
  mode: 'single' | 'multi';
  messages: ChatMessage[];
  createdAt: number;
  activeAgent: string;
}

export type AgentMode = 'single' | 'multi';
