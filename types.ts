export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface MessagePart {
  text?: string;
  image?: string; // base64 encoded image
}

export interface Message {
  id: number;
  role: MessageRole;
  parts: MessagePart[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}
