import React from 'react';
import { Message as MessageType, MessageRole } from '../types';

interface MessageProps {
  message: MessageType;
}

const UserIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-semibold text-gray-600 dark:text-gray-300 flex-shrink-0">
        U
    </div>
)

const ModelIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
        </svg>
    </div>
)

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split('---');
  const mainContent = parts[0];
  const disclaimer = parts[1];

  const renderSection = (sectionText: string) => {
    return sectionText.split('\n').map((line, i) => {
      if (line.trim() === '') return null;
      const boldedLine = line.split('**').map((part, index) => 
        index % 2 === 1 ? <strong key={index}>{part}</strong> : <span key={index}>{part}</span>
      );
      return <p key={i} className="my-1">{boldedLine}</p>;
    }).filter(Boolean);
  };

  return (
    <>
      {renderSection(mainContent)}
      {disclaimer && (
        <>
          <hr className="my-3 border-gray-300 dark:border-gray-600" />
          {renderSection(disclaimer)}
        </>
      )}
    </>
  );
};


export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUserModel = message.role === MessageRole.USER;
  const containerClasses = isUserModel ? 'justify-end' : 'justify-start';
  const bubbleClasses = isUserModel
    ? 'bg-blue-500 text-white'
    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  
  return (
    <div className={`flex items-start gap-3 ${containerClasses}`}>
        {!isUserModel && <ModelIcon />}
        <div className="flex flex-col max-w-lg lg:max-w-2xl">
            <div className={`p-4 rounded-xl shadow-sm ${bubbleClasses}`}>
                <div className="space-y-3">
                {message.parts.map((part, index) => (
                    <div key={index}>
                    {part.image && (
                        <img
                        src={`data:image/jpeg;base64,${part.image}`}
                        alt="User upload"
                        className="rounded-lg max-w-full h-auto mb-2"
                        />
                    )}
                    {part.text && <div className="whitespace-pre-wrap"><FormattedText text={part.text} /></div>}
                    </div>
                ))}
                </div>
            </div>
        </div>
        {isUserModel && <UserIcon />}
    </div>
  );
};
