const EVENT_NAME = 'endurance-storage';

export function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key } }));
}

export function removeItem(key: string): void {
  localStorage.removeItem(key);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key } }));
}

export function subscribe(key: string, callback: () => void): () => void {
  const handler = (e: Event) => {
    if ((e as CustomEvent).detail?.key === key) {
      callback();
    }
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

export function clearAllData(): void {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('endurance:'));
  keys.forEach(k => localStorage.removeItem(k));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key: '*' } }));
}

export function getAllProfileData(profileId: string): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  const keys = Object.keys(localStorage).filter(
    k => k.startsWith('endurance:') && k.includes(profileId)
  );
  keys.forEach(k => {
    try {
      data[k] = JSON.parse(localStorage.getItem(k) || 'null');
    } catch {
      data[k] = localStorage.getItem(k);
    }
  });
  return data;
}
