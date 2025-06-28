'use client';

import { useState, useEffect, useRef } from 'react';
import { Trash2, RefreshCw, MessageSquare, Clock, AlertCircle } from 'lucide-react';

interface Conversation {
  id: string;
  prompt: string;
  response: string;
  timestamp: string;
}

interface ConversationHistoryProps {
  refresh: number;
}

export default function ConversationHistory({ refresh }: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const fetchingRef = useRef(false);
  const lastRefreshRef = useRef<number | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  const fetchConversations = async () => {
    // Prevent duplicate calls
    if (fetchingRef.current) {
      console.log('Fetch already in progress, skipping duplicate call');
      return;
    }

    try {
      fetchingRef.current = true;
      setIsLoading(true);
      setError('');
      
      const response = await fetch(`${backendUrl}/api/conversations`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.status}`);
      }
      
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversations';
      setError(errorMessage);
      console.error('Error fetching conversations:', err);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  };

  const clearAllConversations = async () => {
    if (!confirm('Are you sure you want to clear all conversations? This action cannot be undone.')) {
      return;
    }

    try {
      setIsClearing(true);
      const response = await fetch(`${backendUrl}/api/conversations`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to clear conversations: ${response.status}`);
      }

      setConversations([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear conversations';
      setError(errorMessage);
      console.error('Error clearing conversations:', err);
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    // Prevent duplicate calls for the same refresh value
    if (lastRefreshRef.current === refresh) {
      console.log('Same refresh value, skipping duplicate fetch');
      return;
    }
    
    lastRefreshRef.current = refresh;
    fetchConversations();
  }, [refresh]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-gray-600 dark:text-gray-300">Loading conversations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Error Loading Conversations</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={fetchConversations}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Conversation History
            </h2>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
              {conversations.length}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={fetchConversations}
              disabled={isLoading}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            {conversations.length > 0 && (
              <button
                onClick={clearAllConversations}
                disabled={isClearing}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                title="Clear all conversations"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="max-h-[600px] overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
              No conversations yet
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              Start chatting to see your conversation history here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <div className="space-y-3">
                  {/* Timestamp */}
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(conversation.timestamp)}</span>
                  </div>

                  {/* User Prompt */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">You asked:</div>
                    <div className="text-sm text-gray-800 dark:text-gray-200">
                      {truncateText(conversation.prompt)}
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="bg-gray-50 dark:bg-gray-600/20 p-3 rounded-lg">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">AI responded:</div>
                    <div className="text-sm text-gray-800 dark:text-gray-200">
                      {truncateText(conversation.response, 200)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {conversations.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} stored
          </div>
        </div>
      )}
    </div>
  );
} 