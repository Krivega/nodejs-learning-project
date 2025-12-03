/* eslint-disable import/no-extraneous-dependencies */
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { resolve as resolveTs } from 'ts-node/esm';
import * as tsConfigPaths from 'tsconfig-paths';

import type { NodeLoaderHooksAPI1 } from 'ts-node';

const result = tsConfigPaths.loadConfig();

if (result.resultType === 'failed') {
  throw new Error(result.message);
}

const { absoluteBaseUrl, paths } = result;
const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths);

const extensionFallbacks = new Map<string, string[]>([
  ['.js', ['.ts', '.tsx', '.mts']],
  ['.mjs', ['.mts']],
  ['.cjs', ['.cts']],
  ['.jsx', ['.tsx']],
]);

const resolveWithFallbacks = (specifier: string) => {
  const directMatch = matchPath(specifier);

  if (directMatch !== undefined) {
    return directMatch;
  }

  const extension = path.extname(specifier);
  const fallbacks = extensionFallbacks.get(extension);

  if (fallbacks === undefined) {
    return undefined;
  }

  const specifierWithoutExtension = specifier.slice(0, specifier.length - extension.length);

  for (const fallbackExtension of fallbacks) {
    const remappedSpecifier = `${specifierWithoutExtension}${fallbackExtension}`;
    const remappedMatch = matchPath(remappedSpecifier);

    if (remappedMatch !== undefined) {
      return remappedMatch;
    }
  }

  return undefined;
};

type TContext = Parameters<NodeLoaderHooksAPI1['resolve']>[1];
type TDefaultResolve = Parameters<NodeLoaderHooksAPI1['resolve']>[2];

export async function resolve(
  specifier: string,
  context: TContext,
  defaultResolve: TDefaultResolve,
) {
  const match = resolveWithFallbacks(specifier);

  return match === undefined
    ? resolveTs(specifier, context, defaultResolve)
    : resolveTs(pathToFileURL(match).href, context, defaultResolve);
}

export { load, transformSource } from 'ts-node/esm';
