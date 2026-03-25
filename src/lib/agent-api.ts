import { AgentMode, ChatMessage } from '@/types/agent';

interface BackendMessage {
  role: 'user' | 'assistant' | 'tool';
  content: string;
  sender?: string;
  tool_name?: string;
  tool_call_id?: string;
}

interface BackendChatResponse {
  activeAgent: string;
  messages: Array<{
    role: 'assistant' | 'tool';
    content: string;
    sender?: string | null;
    tool_name?: string | null;
    tool_call_id?: string | null;
  }>;
}

const API_BASE = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL || 'http://localhost:8000';

function toBackendMessages(messages: ChatMessage[]): BackendMessage[] {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant' || m.role === 'tool')
    .map((m) => ({
      role: m.role,
      content: m.content,
      sender: m.sender,
      tool_name: m.tool_name,
      tool_call_id: m.tool_call_id,
    }));
}

function toUiMessages(messages: BackendChatResponse['messages']): ChatMessage[] {
  const now = Date.now();
  return messages
    .filter((m) => !(m.role === 'assistant' && !m.content))
    .map((m, idx) => ({
      id: `api-${now}-${idx}`,
      role: m.role,
      content: m.content,
      sender: m.sender ?? undefined,
      tool_name: m.tool_name ?? undefined,
      tool_call_id: m.tool_call_id ?? undefined,
      ts: now + idx,
    }));
}

export async function runBackendAgent(mode: AgentMode, messages: ChatMessage[], maxTurns = 6): Promise<{ activeAgent: string; messages: ChatMessage[] }> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode,
      messages: toBackendMessages(messages),
      max_turns: maxTurns,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Backend request failed (${response.status}): ${detail}`);
  }

  const data = (await response.json()) as BackendChatResponse;
  return {
    activeAgent: data.activeAgent,
    messages: toUiMessages(data.messages),
  };
}
