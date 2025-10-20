import React from 'react';
import { MenuIcon } from './icons/MenuIcon';

const MedicalCrossIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
    </svg>
);

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm relative">
      <button onClick={onMenuClick} className="absolute left-4 lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <MenuIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>
      <div className="flex items-center space-x-3">
        <MedicalCrossIcon className="w-8 h-8 text-emerald-500" />
        <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
          Medika
        </h1>
      </div>
    </header>
  );
};
