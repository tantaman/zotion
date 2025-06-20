import {namedQuery} from '@rocicorp/zero';
import {builder, DocId, UserId, WorkspaceId} from './schema';

export const allDocTitles = namedQuery(
  'allDocTitles',
  (workspaceId: WorkspaceId) =>
    builder.document.where('workspaceId', workspaceId),
);

export const doc = namedQuery('doc', (docId: DocId) =>
  builder.document.where('id', docId).related('body').one(),
);

export const user = namedQuery('user', (userId: UserId) =>
  builder.user.where('id', userId).one(),
);

export const workspace = namedQuery('workspace', (workspaceId: WorkspaceId) =>
  builder.workspace.where('id', workspaceId).one(),
);

export const docBody = namedQuery('docBody', (docId: DocId) =>
  builder.documentBody.where('documentId', docId).one(),
);
