import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatHistory } from './components/ChatHistory';
import { InputArea } from './components/InputArea';
import { HistoryPanel } from './components/HistoryPanel';
import { SuggestedQuestions } from './components/SuggestedQuestions';
import { getMedicalResponse } from './services/geminiService';
import { Message, MessageRole, Conversation } from './types';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(true);

  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // Load conversations from local storage on initial render
  useEffect(() => {
    try {
      const savedConversations = localStorage.getItem('medika-conversations');
      if (savedConversations) {
        const parsedConversations = JSON.parse(savedConversations);
        setConversations(parsedConversations);
        if (parsedConversations.length > 0) {
          setActiveConversationId(parsedConversations[0].id);
        } else {
          handleNewConversation();
        }
      } else {
        handleNewConversation();
      }
    } catch (error) {
        console.error("Failed to load conversations from local storage:", error);
        handleNewConversation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save conversations to local storage whenever they change
  useEffect(() => {
    if(conversations.length > 0) {
        localStorage.setItem('medika-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [conversations, activeConversationId]);

  const handleNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: `convo-${Date.now()}`,
      title: 'New Conversation',
      messages: [
        {
          role: MessageRole.MODEL,
          parts: [{ text: "Hello! I'm Medika, your AI medical assistant. Please upload an image and ask a question about your medical query." }],
          id: Date.now(),
        },
        {
          role: MessageRole.MODEL,
          parts: [{ text: "**Disclaimer:** I am an AI assistant and not a medical professional. Please consult a doctor for any serious health concerns." }],
          id: Date.now() + 1,
        },
      ],
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  }, []);

  const handleDeleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      const remainingConversations = conversations.filter(c => c.id !== id);
      if (remainingConversations.length > 0) {
        setActiveConversationId(remainingConversations[0].id);
      } else {
        handleNewConversation();
      }
    }
  }, [activeConversationId, conversations, handleNewConversation]);

  const handleSendMessage = useCallback(async (text: string, image: { base64: string; mimeType: string } | null = null) => {
    if (!text && !image) return;

    setIsLoading(true);
    setError(null);
    setSuggestedQuestions([]);

    const userMessage: Message = {
      id: Date.now(),
      role: MessageRole.USER,
      parts: [],
    };
    if (text) userMessage.parts.push({ text });
    if (image) userMessage.parts.push({ image: image.base64 });

    // Add user message and update title if it's the first message
    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConversationId) {
            const isFirstUserMessage = c.messages.filter(m => m.role === MessageRole.USER).length === 0;
            const newTitle = isFirstUserMessage && text ? text.substring(0, 40) + (text.length > 40 ? '...' : '') : c.title;
            return { ...c, title: newTitle, messages: [...c.messages, userMessage] };
        }
        return c;
      })
    );

    try {
      const response = await getMedicalResponse(text, image);
      const modelMessage: Message = {
        id: Date.now() + 1,
        role: MessageRole.MODEL,
        parts: [{ text: response.response }],
      };
      
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversationId
            ? { ...c, messages: [...c.messages, modelMessage] }
            : c
        )
      );
      setSuggestedQuestions(response.suggestions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      const errorModelMessage: Message = {
        id: Date.now() + 1,
        role: MessageRole.MODEL,
        parts: [{ text: `Sorry, I encountered an error: ${errorMessage}` }],
      };
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversationId
            ? { ...c, messages: [...c.messages, errorModelMessage] }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="flex h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
      <HistoryPanel
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={isHistoryPanelOpen}
        setIsOpen={setIsHistoryPanelOpen}
      />
      <div className="flex flex-col flex-1">
        <Header onMenuClick={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)} />
        <main ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {activeConversation && <ChatHistory messages={activeConversation.messages} />}
          {error && <div className="text-red-500 text-center p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">{error}</div>}
        </main>
        {suggestedQuestions.length > 0 && !isLoading && (
          <div className="p-4 md:px-6">
            <SuggestedQuestions 
              suggestions={suggestedQuestions} 
              onSuggestionClick={(suggestion) => handleSendMessage(suggestion)} 
            />
          </div>
        )}
        <footer className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
        </footer>
      </div>
    </div>
  );
};

export default App;
