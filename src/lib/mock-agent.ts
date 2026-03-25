import { ChatMessage, AgentMode } from '@/types/agent';

let idCounter = 0;
const uid = () => `msg-${Date.now()}-${++idCounter}`;

interface AgentResponse {
  activeAgent: string;
  messages: ChatMessage[];
}

const weatherResponses = [
  { temp: '72°F', condition: 'sunny', location: 'Brussels' },
  { temp: '58°F', condition: 'cloudy', location: 'London' },
  { temp: '85°F', condition: 'hot and humid', location: 'Tokyo' },
];

function simulateSingleAgent(userMsg: string): AgentResponse {
  const lower = userMsg.toLowerCase();
  const messages: ChatMessage[] = [];
  const now = Date.now();

  if (lower.includes('weather') || lower.includes('temperature') || lower.includes('forecast')) {
    const loc = lower.includes('brussels') ? 0 : lower.includes('london') ? 1 : lower.includes('tokyo') ? 2 : Math.floor(Math.random() * 3);
    const w = weatherResponses[loc];

    messages.push({
      id: uid(), role: 'tool', content: JSON.stringify({ location: w.location, temperature: w.temp, condition: w.condition }),
      tool_name: 'get_weather', tool_call_id: `call-${now}`,
      tool_args: { location: w.location, time: 'now' }, ts: now,
    });
    messages.push({
      id: uid(), role: 'assistant', sender: 'Weather Agent',
      content: `The weather in ${w.location} is currently ${w.temp} and ${w.condition}. Would you like me to send this as an email?`,
      ts: now + 100,
    });
  } else if (lower.includes('email') || lower.includes('send')) {
    messages.push({
      id: uid(), role: 'tool', content: 'Sent! email to user@example.com with the subject: Weather Update',
      tool_name: 'send_email', tool_call_id: `call-${now}`,
      tool_args: { recipient: 'user@example.com', subject: 'Weather Update', body: 'Here is your weather info.' }, ts: now,
    });
    messages.push({
      id: uid(), role: 'assistant', sender: 'Weather Agent',
      content: 'Done! I\'ve sent the weather update email to user@example.com.',
      ts: now + 100,
    });
  } else {
    messages.push({
      id: uid(), role: 'assistant', sender: 'Weather Agent',
      content: 'I\'m the Weather Agent! I can help you check the weather in any city or send weather updates via email. Try asking "What\'s the weather in Brussels?"',
      ts: now,
    });
  }

  return { activeAgent: 'Weather Agent', messages };
}

function simulateMultiAgent(userMsg: string, currentAgent: string): AgentResponse {
  const lower = userMsg.toLowerCase();
  const messages: ChatMessage[] = [];
  const now = Date.now();

  if (currentAgent === 'Triage Agent') {
    if (lower.includes('refund') || lower.includes('return') || lower.includes('complaint') || lower.includes('expensive')) {
      messages.push({
        id: uid(), role: 'assistant', sender: 'Triage Agent',
        content: 'I\'ll transfer you to our Refunds specialist right away.',
        ts: now,
      });
      messages.push({
        id: uid(), role: 'assistant', sender: 'Refunds Agent',
        content: 'Hello! I\'m the Refunds Agent. I can help you with returns and refunds. Could you tell me your item ID (format: item_...) and the reason for the refund?',
        ts: now + 200,
      });
      return { activeAgent: 'Refunds Agent', messages };
    } else if (lower.includes('buy') || lower.includes('price') || lower.includes('product') || lower.includes('sale') || lower.includes('discount') || lower.includes('bee')) {
      messages.push({
        id: uid(), role: 'assistant', sender: 'Triage Agent',
        content: 'Let me connect you with our Sales team!',
        ts: now,
      });
      messages.push({
        id: uid(), role: 'assistant', sender: 'Sales Agent',
        content: '🐝 Hey there! Welcome to BeeStore! We have the BEST bees in the market! Are you looking for honeybees, bumblebees, or our premium queen bee package?',
        ts: now + 200,
      });
      return { activeAgent: 'Sales Agent', messages };
    } else {
      messages.push({
        id: uid(), role: 'assistant', sender: 'Triage Agent',
        content: 'Welcome! I can route you to the right specialist. For purchases and products, I\'ll connect you with Sales. For refunds and returns, I\'ll get you to our Refunds team. How can I help?',
        ts: now,
      });
      return { activeAgent: 'Triage Agent', messages };
    }
  }

  if (currentAgent === 'Refunds Agent') {
    if (lower.includes('item_')) {
      const itemMatch = lower.match(/item_\w+/);
      const itemId = itemMatch ? itemMatch[0] : 'item_unknown';
      messages.push({
        id: uid(), role: 'tool', content: `Success! Refund processed for ${itemId}.`,
        tool_name: 'process_refund', tool_call_id: `call-${now}`,
        tool_args: { item_id: itemId, reason: 'Customer request' }, ts: now,
      });
      messages.push({
        id: uid(), role: 'assistant', sender: 'Refunds Agent',
        content: `Your refund for ${itemId} has been processed successfully! Is there anything else I can help with?`,
        ts: now + 100,
      });
    } else if (lower.includes('expensive') || lower.includes('code') || lower.includes('discount')) {
      messages.push({
        id: uid(), role: 'tool', content: 'Applied discount of 11%',
        tool_name: 'apply_discount', tool_call_id: `call-${now}`, ts: now,
      });
      messages.push({
        id: uid(), role: 'assistant', sender: 'Refunds Agent',
        content: 'I\'ve applied an 11% discount to your cart as a goodwill gesture! Would you still like to proceed with a refund?',
        ts: now + 100,
      });
    } else {
      messages.push({
        id: uid(), role: 'assistant', sender: 'Refunds Agent',
        content: 'Please provide your item ID (format: item_xxx) and I\'ll process the refund right away. If the item was too expensive, I can also offer you a discount code instead.',
        ts: now,
      });
    }
    return { activeAgent: 'Refunds Agent', messages };
  }

  if (currentAgent === 'Sales Agent') {
    if (lower.includes('back') || lower.includes('triage') || lower.includes('refund')) {
      messages.push({
        id: uid(), role: 'assistant', sender: 'Sales Agent',
        content: 'No worries! Let me transfer you back.',
        ts: now,
      });
      messages.push({
        id: uid(), role: 'assistant', sender: 'Triage Agent',
        content: 'I\'m back! How can I help you?',
        ts: now + 200,
      });
      return { activeAgent: 'Triage Agent', messages };
    }
    messages.push({
      id: uid(), role: 'assistant', sender: 'Sales Agent',
      content: '🐝 Absolutely BUZZING to help! Our bees are top-tier, locally sourced, and come with a 30-day satisfaction guarantee. Want me to add some to your cart?',
      ts: now,
    });
    return { activeAgent: 'Sales Agent', messages };
  }

  return { activeAgent: currentAgent, messages: [{ id: uid(), role: 'assistant', sender: currentAgent, content: 'How can I help you?', ts: now }] };
}

export function runMockAgent(mode: AgentMode, userMsg: string, currentAgent: string): AgentResponse {
  if (mode === 'single') return simulateSingleAgent(userMsg);
  return simulateMultiAgent(userMsg, currentAgent);
}

export function getInitialAgent(mode: AgentMode): string {
  return mode === 'single' ? 'Weather Agent' : 'Triage Agent';
}
