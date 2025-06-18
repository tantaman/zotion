import {
  pgTable,
  text,
  boolean,
  timestamp,
  pgEnum,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core';
import {relations} from 'drizzle-orm';
import {DocId, UserId, WorkspaceId} from '../../zero/schema';

// Enum for document visibility
export const documentVisibilityEnum = pgEnum('document_visibility', [
  'private',
  'public',
  'members',
]);

// Workspace table
export const workspace = pgTable('workspace', {
  id: text('id').$type<WorkspaceId>().primaryKey(),
  name: text('name').notNull(),
});

// User table
export const user = pgTable('user', {
  id: text('id').$type<UserId>().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emoji: text('emoji').notNull(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {onDelete: 'cascade'}),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp('updated_at').$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

// Document table
export const document = pgTable(
  'document',
  {
    id: text('id').$type<DocId>().primaryKey(),
    ownerId: text('owner_id')
      .$type<UserId>()
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
    workspaceId: text('workspace_id')
      .$type<WorkspaceId>()
      .notNull()
      .references(() => workspace.id, {onDelete: 'cascade'}),
    visibility: documentVisibilityEnum('visibility').notNull(),
    title: text('title').notNull(),
    created: timestamp('created', {mode: 'date'}).notNull().defaultNow(),
    modified: timestamp('modified', {mode: 'date'}).notNull().defaultNow(),
    emoji: text('emoji'),
  },
  table => [index('document_workspace_id_idx').on(table.workspaceId)],
);

// Document body table
export const documentBody = pgTable('document_body', {
  documentId: text('document_id')
    .$type<DocId>()
    .notNull()
    .references(() => document.id, {onDelete: 'cascade'})
    .primaryKey(),
  content: text('content').notNull(),
});

// Workspace members junction table
export const workspaceMember = pgTable(
  'workspace_member',
  {
    workspaceId: text('workspace_id')
      .notNull()
      .references(() => workspace.id, {onDelete: 'cascade'}),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {onDelete: 'cascade'}),
  },
  table => [
    primaryKey({columns: [table.workspaceId, table.userId]}),
    index('workspace_member_workspace_id_idx').on(table.workspaceId),
    index('workspace_member_user_id_idx').on(table.userId),
  ],
);

// Relations
export const workspaceRelations = relations(workspace, ({many}) => ({
  documents: many(document),
  members: many(workspaceMember),
}));

export const userRelations = relations(user, ({many}) => ({
  workspaceMemberships: many(workspaceMember),
}));

export const documentRelations = relations(document, ({one, many}) => ({
  workspace: one(workspace, {
    fields: [document.workspaceId],
    references: [workspace.id],
  }),
  body: one(documentBody),
}));

export const documentBodyRelations = relations(documentBody, ({one}) => ({
  document: one(document, {
    fields: [documentBody.documentId],
    references: [document.id],
  }),
}));

export const workspaceMemberRelations = relations(workspaceMember, ({one}) => ({
  workspace: one(workspace, {
    fields: [workspaceMember.workspaceId],
    references: [workspace.id],
  }),
  user: one(user, {
    fields: [workspaceMember.userId],
    references: [user.id],
  }),
}));
