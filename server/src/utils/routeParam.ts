/**
 * Normalize Express route/param values (Express 5 may yield `string | string[]`).
 * Accepts unknown for bodies after validation/middleware loosening types.
 */
export function routeParam(val: unknown): string {
  if (typeof val === 'string') return val;
  if (Array.isArray(val) && typeof val[0] === 'string') return val[0] ?? '';
  return '';
}
