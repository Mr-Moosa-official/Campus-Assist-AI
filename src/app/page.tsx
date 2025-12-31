'use client';
import { useState } from 'react';
import Header from '@/components/header';
import ChatInterface from '@/components/chat/chat-interface';

export default function Home() {
  const [language, setLanguage] = useState('en');

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header language={language} onLanguageChange={setLanguage} />
      <main className="flex-1 overflow-hidden p-4">
        <ChatInterface language={language} />
      </main>
    </div>
  );
}
