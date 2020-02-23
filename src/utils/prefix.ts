export const addPrefix = (key: string): string =>
  key.length === 1 ? `-${key}` : `--${key}`;

export const removePrefix = (key: string): string => {
  if (key.indexOf('--') === 0) {
    return key.slice(2);
  } else if (key.indexOf('-') === 0) {
    return key.slice(1);
  } else {
    throw new Error(`This flag hasn't prefix.`);
  }
};
