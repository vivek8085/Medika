import React from 'react';
import { Conversation } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryPanelProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  setIsOpen
}) => {
  const panelClasses = isOpen
    ? 'translate-x-0'
    : '-translate-x-full';
    
  return (
    <>
      <aside className={`absolute lg:static z-20 inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 transform transition-transform duration-300 ease-in-out ${panelClasses} flex flex-col`}>
        <button
            onClick={onNewConversation}
            className="w-full flex items-center justify-center gap-2 p-2 mb-4 text-sm font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
        >
            <PlusIcon className="w-5 h-5" />
            New Chat
        </button>
        <div className="flex-1 overflow-y-auto -mr-2 pr-2 space-y-1">
            {conversations.map((convo) => (
            <div
                key={convo.id}
                onClick={() => onSelectConversation(convo.id)}
                className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                activeConversationId === convo.id
                    ? 'bg-emerald-100 dark:bg-emerald-900/50'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
                <p className={`flex-1 truncate text-sm ${activeConversationId === convo.id ? 'font-semibold text-emerald-800 dark:text-emerald-100' : 'text-gray-700 dark:text-gray-300'}`}>
                {convo.title}
                </p>
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(convo.id);
                }}
                className="p-1 rounded-md text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-opacity"
                aria-label="Delete conversation"
                >
                <TrashIcon className="w-4 h-4" />
                </button>
            </div>
            ))}
        </div>
      </aside>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-10 bg-black/30 lg:hidden"></div>}
    </>
  );
};
