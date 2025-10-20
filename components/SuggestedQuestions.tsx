import React from 'react';

interface SuggestedQuestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ suggestions, onSuggestionClick }) => {
  return (
    <div className="max-w-4xl mx-auto">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 text-center">Suggested for you</p>
        <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion, index) => (
                <button
                    key={index}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    {suggestion}
                </button>
            ))}
        </div>
    </div>
  );
};
