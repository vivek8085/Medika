
import React from 'react';
import { Message as MessageType } from '../types';
import { Message } from './Message';

interface ChatHistoryProps {
  messages: MessageType[];
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  return (
    <div className="space-y-6">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
    </div>
  );
};
