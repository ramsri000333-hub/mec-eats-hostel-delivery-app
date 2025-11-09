export const isBrowser = () => typeof window !== 'undefined';

export const getLocation = () => {
  return isBrowser() ? window.location : null;
};