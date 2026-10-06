// IndexedDB helper for storing uploaded champion video reliably across sessions and refreshes
const DB_NAME = 'ErenTekstilMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';
const KEY_CHAMPION_VIDEO = 'champion_celebration_video';

interface StoredVideoRecord {
  id: string;
  blob: Blob;
  name: string;
  type: string;
  updatedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open database'));
    };
  });
}

export async function saveVideoToStorage(file: File | Blob, name: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record: StoredVideoRecord = {
        id: KEY_CHAMPION_VIDEO,
        blob: file,
        name: name,
        type: file.type || 'video/mp4',
        updatedAt: Date.now(),
      };

      const putRequest = store.put(record);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    });
  } catch (err) {
    console.error('Error saving video to IndexedDB:', err);
  }
}

export async function loadVideoFromStorage(): Promise<{ blob: Blob; name: string; url: string } | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get(KEY_CHAMPION_VIDEO);

      getRequest.onsuccess = () => {
        const record = getRequest.result as StoredVideoRecord | undefined;
        if (record && record.blob) {
          const url = URL.createObjectURL(record.blob);
          resolve({
            blob: record.blob,
            name: record.name,
            url,
          });
        } else {
          resolve(null);
        }
      };

      getRequest.onerror = () => {
        resolve(null);
      };
    });
  } catch (err) {
    console.error('Error loading video from IndexedDB:', err);
    return null;
  }
}

export async function deleteVideoFromStorage(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const delRequest = store.delete(KEY_CHAMPION_VIDEO);
      delRequest.onsuccess = () => resolve();
      delRequest.onerror = () => resolve();
    });
  } catch (err) {
    console.error('Error deleting video from IndexedDB:', err);
  }
}
