export const escapeString   = str => JSON.stringify(str).slice(1, -1);
export const unescapeString = str => {
  /* wrap into a JSON string literal and let JSON.parse do the work   */
  /* any invalid escape will throw which we bubble up to the caller   */
  return JSON.parse(`"${str}"`);
};