'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import ConversationHistory from '@/components/ConversationHistory';

export default function Home() {
  const [showHistory, setShowHistory] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleNewConversation = () => {
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Workiva AI Assistant
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Powered by Google Gemini AI, this intelligent assistant can help you with questions, 
            creative tasks, analysis, and much more.
          </p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex">
            <button
              onClick={() => setShowHistory(false)}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                !showHistory
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className={`px-6 py-2 rounded-md transition-all duration-200 ${
                showHistory
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              History
            </button>
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {!showHistory ? (
            <ChatInterface onNewConversation={handleNewConversation} />
          ) : (
            <ConversationHistory refresh={refreshHistory} />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 dark:text-gray-400">
          <p>Built with Next.js, FastAPI, and Google Gemini AI</p>
          <p className="text-sm mt-2">Workiva Technical Assessment by Darshan Rao</p>
        </footer>
      </div>
    </main>
  );
}
