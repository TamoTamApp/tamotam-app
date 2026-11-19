import { getApp } from "@react-native-firebase/app";
import { getAnalytics, logEvent, logScreenView } from "@react-native-firebase/analytics";
import { getCrashlytics, recordError } from "@react-native-firebase/crashlytics";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "@react-native-firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  putFile,
  ref,
  type StorageReference,
} from "@react-native-firebase/storage";

/**
 * React Native Firebase v26 removed the namespaced API this app was written
 * against. These wrappers keep the call sites (`analytics().logEvent`,
 * `firestore().collection`, `storage().ref`) on the modular SDK.
 */

export function analytics() {
  const instance = getAnalytics(getApp());
  return {
    logEvent: (name: string, params?: Record<string, unknown>) =>
      logEvent(instance, name, params),
    logScreenView: (params: { screen_name?: string; screen_class?: string }) =>
      logScreenView(instance, params),
  };
}

export function crashlytics() {
  const instance = getCrashlytics(getApp());
  return {
    recordError: (error: Error) => recordError(instance, error),
  };
}

function documentRef(collectionName: string, id: string) {
  return {
    id,
    _documentPath: { _parts: [collectionName, id] },
  };
}

export function firestore() {
  const database = getFirestore(getApp());
  return {
    collection: (name: string) => ({
      add: async (data: object) => {
        const created = await addDoc(collection(database, name), data as never);
        return documentRef(name, created.id);
      },
      get: async () => {
        const snapshot = await getDocs(collection(database, name));
        return {
          forEach: (
            callback: (documentSnapshot: {
              data: () => Record<string, any>;
              ref: { id: string; _documentPath: { _parts: string[] } };
            }) => void
          ) => {
            snapshot.forEach((documentSnapshot) => {
              callback({
                data: () => documentSnapshot.data() as Record<string, any>,
                ref: documentRef(name, documentSnapshot.id),
              });
            });
          },
        };
      },
      doc: (id: string | undefined) => ({
        update: (data: object) =>
          updateDoc(doc(database, name, id as string), data as never),
      }),
    }),
  };
}

function wrapStorageReference(storageRef: StorageReference) {
  return {
    fullPath: storageRef.fullPath,
    path: storageRef.fullPath,
    getDownloadURL: () => getDownloadURL(storageRef),
    putFile: (filePath: string) => putFile(storageRef, filePath),
  };
}

export function storage() {
  const instance = getStorage(getApp());
  return {
    ref: (path?: string) => wrapStorageReference(ref(instance, path)),
    refFromURL: (url: string) => wrapStorageReference(ref(instance, url)),
  };
}
