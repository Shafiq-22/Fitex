import { useState, useRef, useEffect } from 'react';
import { useStorage } from '../../hooks/useStorage';
import { useProfile } from '../../contexts/ProfileContext';
import { generateId } from '../../lib/id';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MessageBubble } from './MessageBubble';
import { PromptSuggestions } from './PromptSuggestions';
import type { ChatMessage, ChatSession, ProfileSettings } from '../../types';

export function ChatInterface() {
  const { activeProfile } = useProfile();
  const profileId = activeProfile?.id ?? '';
  const [session, setSession] = useStorage<ChatSession>(`endurance:chat:${profileId}`, {
    profileId,
    messages: [],
  });
  const [settings] = useStorage<ProfileSettings>(`endurance:settings:${profileId}`, {
    profileId,
    theme: 'light',
    units: 'metric',
    notifications: { enabled: false },
    feedback: { vibration: true, sound: false },
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiKey = settings.coachApiKey;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages]);

  function buildSystemPrompt(): string {
    const profile = activeProfile;
    const data = profile?.onboardingData;
    let context = 'You are an expert fitness coach. Provide helpful, concise, and actionable fitness advice.';
    if (profile) {
      context += ` The user's name is ${profile.name}.`;
    }
    if (data) {
      if (data.goal) context += ` Their goal is ${data.goal.replace('_', ' ')}.`;
      if (data.experienceLevel) context += ` Experience level: ${data.experienceLevel}.`;
      if (data.bodyWeight) context += ` Body weight: ${data.bodyWeight}${data.units === 'metric' ? 'kg' : 'lbs'}.`;
      if (data.daysPerWeek) context += ` They train ${data.daysPerWeek} days per week.`;
    }
    return context;
  }

  async function sendMessage(text: string) {
    if (!text.trim() || !apiKey || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...session.messages, userMessage];
    setSession({ ...session, messages: updatedMessages });
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: buildSystemPrompt(),
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantContent =
        data.content?.[0]?.text ?? 'Sorry, I could not generate a response.';

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date().toISOString(),
      };

      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
      }));
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `Something went wrong: ${err instanceof Error ? err.message : 'Unknown error'}. Please check your API key and try again.`,
        timestamp: new Date().toISOString(),
      };
      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  if (!apiKey) {
    return (
      <Card className="text-center py-12">
        <p className="text-4xl mb-4">🤖</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Set Up AI Coach
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-xs mx-auto">
          Add your Anthropic API key in Settings to start chatting with your AI fitness coach.
        </p>
        <Button variant="secondary" size="sm" onClick={() => window.location.hash = '#/settings'}>
          Go to Settings
        </Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {session.messages.length === 0 ? (
          <div>
            <div className="text-center py-8">
              <p className="text-4xl mb-3">💪</p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                AI Fitness Coach
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ask me anything about fitness, nutrition, or your training.
              </p>
            </div>
            <PromptSuggestions onSelect={sendMessage} />
          </div>
        ) : (
          <>
            {session.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-[pulse_1.4s_ease-in-out_infinite]" />
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-[pulse_1.4s_ease-in-out_0.2s_infinite]" />
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-[pulse_1.4s_ease-in-out_0.4s_infinite]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your coach..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="shrink-0"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
