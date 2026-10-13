// Penyimpanan lokal yang aman untuk browser yang membatasi localStorage.
export function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
export function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* penyimpanan opsional */
  }
}
export function storageGetJSON(key, fallback = []) {
  try {
    const value = JSON.parse(storageGet(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}
