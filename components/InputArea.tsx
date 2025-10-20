
import React, { useState, useRef } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { PlusIcon } from './icons/PlusIcon';
import { SendIcon } from './icons/SendIcon';
import { ImageIcon } from './icons/ImageIcon';

interface InputAreaProps {
  onSendMessage: (text: string, image: { base64: string; mimeType: string } | null) => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          file: file,
          preview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!text && !image) || isLoading) return;

    let imagePayload: { base64: string; mimeType: string } | null = null;
    if (image) {
      const base64String = image.preview.split(',')[1];
      imagePayload = {
        base64: base64String,
        mimeType: image.file.type,
      };
    }
    onSendMessage(text, imagePayload);
    setText('');
    setImage(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        {image && (
            <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg inline-block relative">
                <img src={image.preview} alt="Preview" className="h-20 w-20 object-cover rounded-md"/>
                <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">
                    &times;
                </button>
            </div>
        )}
        <div className="flex items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Upload image"
            >
                <ImageIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                placeholder="Ask about your medical image..."
                className="flex-1 bg-transparent focus:outline-none resize-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                rows={1}
            />
            <button
                onClick={handleSend}
                disabled={isLoading || (!text && !image)}
                className="p-2 rounded-full bg-emerald-500 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
                aria-label="Send message"
            >
                {isLoading ? <LoadingSpinner /> : <SendIcon className="w-6 h-6" />}
            </button>
        </div>
    </div>
  );
};
