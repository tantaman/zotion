import {definePermissions, querify} from '@rocicorp/zero';
import {schema, type Schema} from './schema.gen';
export {schema, type Schema};

export type AuthData = {
  // The logged-in user.
  sub: string;
};

export const permissions = definePermissions<{}, Schema>(schema, () => {
  return {};
});

export const builder = querify(schema);

export type Opaque<BaseType, BrandType = unknown> = BaseType & {
  readonly [Symbols.base]: BaseType;
  readonly [Symbols.brand]: BrandType;
};

namespace Symbols {
  export declare const base: unique symbol;
  export declare const brand: unique symbol;
}

export type ID_of<T> = Opaque<string, T>;
export type IID_of<T> = Opaque<bigint, T>;

export type DocId = ID_of<'Doc'>;
export type WorkspaceId = ID_of<'Workspace'>;
export type UserId = ID_of<'User'>;
