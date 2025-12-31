'use client';

import Image from 'next/image';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ChatResponseParser from '@/components/chat/chat-response-parser';
import type { Message } from '@/components/chat/chat-interface';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const botAvatar = PlaceHolderImages.find(img => img.id === 'bot-avatar');

type ChatMessageProps = {
  message: Message;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  return (
    <div
      className={cn(
        'flex items-start gap-3 animate-in fade-in duration-300',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="w-8 h-8">
          {botAvatar && (
            <AvatarImage
              src={botAvatar.imageUrl}
              alt={botAvatar.description}
              data-ai-hint={botAvatar.imageHint}
              width={32}
              height={32}
            />
          )}
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'p-3 rounded-lg max-w-sm md:max-w-md lg:max-w-xl shadow-sm',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <ChatResponseParser content={message.content} />
        )}
      </div>
      {isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
