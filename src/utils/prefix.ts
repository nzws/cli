export const addPrefix = (key: string): string =>
  (key.length === 1 ? '-' : '--') + key;

export const removePrefix = (key: string): string => {
  const [f, s] = key.split('');

  if (f === '-') {
    return key.slice(s === '-' ? 2 : 1);
  } else {
    throw new Error(`This flag hasn't prefix.`);
  }
};
