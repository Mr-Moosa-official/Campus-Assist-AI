'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ArrowUp, Bot } from 'lucide-react';
import { getAiResponse } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ChatMessage from '@/components/chat/chat-message';
import { ScrollArea } from '@/components/ui/scroll-area';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const initialState: {
  success: boolean;
  response?: string;
  error?: string;
} = {
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} aria-label="Send message">
      {pending ? (
        <div className="w-5 h-5 border-2 rounded-full border-background/50 border-t-background animate-spin" />
      ) : (
        <ArrowUp />
      )}
    </Button>
  );
}

export default function ChatInterface({ language }: { language: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, formAction] = useFormState(getAiResponse, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.success && state.response) {
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: state.response },
      ]);
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleFormSubmit = async (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query.trim()) return;

    setMessages(prev => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: query },
    ]);
    
    formAction(formData);
    formRef.current?.reset();
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg shadow-lg border">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-[60vh] items-center justify-center">
              <div className="p-8 text-center">
                <div className="inline-block p-4 rounded-full bg-primary/10">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h2 className="mt-4 text-2xl font-semibold font-headline">Welcome to CampusAssist AI</h2>
                <p className="mt-2 text-muted-foreground">Ask me anything about campus life, courses, or events!</p>
              </div>
            </div>
          ) : (
            messages.map(message => <ChatMessage key={message.id} message={message} />)
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t rounded-b-lg bg-background/50">
        <form
          ref={formRef}
          action={handleFormSubmit}
          className="flex items-center gap-2"
        >
          <Input
            name="query"
            placeholder="Ask a question..."
            className="flex-1"
            autoComplete="off"
            required
          />
          <input type="hidden" name="language" value={language} />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
