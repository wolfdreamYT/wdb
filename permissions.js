const DB_NAME = "userDB";
const DB_VERSION = 2;
const TITLE_STORE = "users";
const USED_KEYS_STORE = "usedKeys";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(TITLE_STORE)) {
        db.createObjectStore(TITLE_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(USED_KEYS_STORE)) {
        db.createObjectStore(USED_KEYS_STORE, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Failed to open IndexedDB");
  });
}

export async function getUserTitle() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TITLE_STORE, "readonly");
    const store = tx.objectStore(TITLE_STORE);
    const req = store.get(1);
    req.onsuccess = () => resolve(req.result?.title || null);
    req.onerror = () => reject("Failed to get title");
  });
}

export async function setUserTitle(title) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TITLE_STORE, "readwrite");
    const store = tx.objectStore(TITLE_STORE);
    const req = store.put({ id: 1, title });
    req.onsuccess = () => resolve();
    req.onerror = () => reject("Failed to save title");
  });
}

export async function isKeyUsed(key) {
  const db = await openDatabase();
  return new Promise((resolve) => {
    const tx = db.transaction(USED_KEYS_STORE, "readonly");
    const store = tx.objectStore(USED_KEYS_STORE);
    const req = store.get(key);
    req.onsuccess = () => resolve(!!req.result);
    req.onerror = () => resolve(false);
  });
}

export async function markKeyAsUsed(key) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(USED_KEYS_STORE, "readwrite");
    const store = tx.objectStore(USED_KEYS_STORE);
    const req = store.put({ key });
    req.onsuccess = () => resolve();
    req.onerror = () => reject("Failed to mark key as used");
  });
}
