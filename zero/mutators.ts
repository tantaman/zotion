import {mutator, Transaction} from '@rocicorp/zero';
import {Schema} from './schema.gen';
import {DocId, UserId, WorkspaceId} from './schema';

export const createDoc = mutator(
  'createDoc',
  async (
    tx: Transaction<Schema>,
    doc: {
      id: DocId;
      ownerId: UserId;
      workspaceId: WorkspaceId;
      title: string;
      emoji?: string;
    },
  ) => {
    tx.mutate.document.insert({
      id: doc.id,
      ownerId: doc.ownerId,
      workspaceId: doc.workspaceId,
      title: doc.title,
      created: Date.now(),
      modified: Date.now(),
      emoji: doc.emoji,
      visibility: 'private',
    });
  },
);

export const createDocBody = mutator(
  'createDocBody',
  async (
    tx: Transaction<Schema>,
    docBody: {
      documentId: DocId;
      content?: string;
    },
  ) => {
    tx.mutate.documentBody.insert({
      documentId: docBody.documentId,
      content: docBody.content ?? '',
    });
  },
);

export const updateDoc = mutator(
  'updateDoc',
  async (
    tx: Transaction<Schema>,
    doc: {
      id: DocId;
      title?: string;
      emoji?: string;
      visibility?: 'private' | 'public' | 'members';
    },
  ) => {
    tx.mutate.document.update({
      ...doc,
      modified: Date.now(),
    });
  },
);

// TODO: this will change to surgical updates in the future
export const updateDocBody = mutator(
  'updateDocBody',
  async (
    tx: Transaction<Schema>,
    docBody: {
      documentId: DocId;
      content: string;
    },
  ) => {
    tx.mutate.documentBody.update(docBody);
  },
);
