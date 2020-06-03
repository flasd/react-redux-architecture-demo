function ensurePresent(variable?: string): string {
  if (process.env.NODE_ENV === 'development' && !variable) {
    console.warn(new Error('Missing ENV variable!'));
  }

  return variable || '';
}

export const NODE_ENV = ensurePresent(process.env.NODE_ENV);

export const FIREBASE_CONFIG = ensurePresent(
  process.env.REACT_APP_FIREBASE_CONFIG,
);
