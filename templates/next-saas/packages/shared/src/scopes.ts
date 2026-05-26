import type { ApiScope } from '@__APP_SCOPE__/types';

export const defaultApiScopes: ApiScope[] = ['read'];

export function hasScope(scopes: string[], required: ApiScope) {
  return scopes.includes(required) || scopes.includes('write');
}
