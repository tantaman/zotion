export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  isPublic: boolean;
  emoji?: string;
}

export interface Workspace {
  id: string;
  name: string;
  documents: Document[];
}