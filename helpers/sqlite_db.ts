import * as SQLite from "expo-sqlite";
import { analytics, crashlytics } from "./firebase";

const CREATE_SAVED_EVENTS_TABLE = `CREATE TABLE IF NOT EXISTS savedEvents (id INTEGER PRIMARY KEY NOT NULL, date REAL NOT NULL, description TEXT, firestoreDocumentId TEXT, imageUrl TEXT, isUserEvent INTEGER NOT NULL, latitude REAL NOT NULL, longitude REAL NOT NULL, title TEXT)`;

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = (async () => {
      const database = await SQLite.openDatabaseAsync("savedEvents.db");
      await database.execAsync(CREATE_SAVED_EVENTS_TABLE);
      return database;
    })();
  }
  return databasePromise;
}

export const init: () => Promise<unknown> = async () => {
  try {
    const result = await getDatabase();
    analytics().logEvent("custom_log", {
      description: "--- Analytics: helpers -> sqlite_db -> init -> (transaction, result), result: " + result,
    });
    return result;
  } catch (error: unknown) {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: helpers -> sqlite_db -> init -> (transaction, error), error: " + error,
    });
    if (error instanceof Error) {
      crashlytics().recordError(error);
    }
    throw error;
  }
};

export const deleteSavedEvent: (id: number | string) => Promise<unknown> = async (
  id: number | string
) => {
  try {
    const database = await getDatabase();
    const result = await database.runAsync(`DELETE FROM savedEvents WHERE id = ?;`, [id]);
    analytics().logEvent("custom_log", {
      description: "--- Analytics: helpers -> sqlite_db -> deleteSavedEvent -> (transaction, result), result: " + result,
    });
    return result;
  } catch (error: unknown) {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: helpers -> sqlite_db -> deleteSavedEvent -> (transaction, error), error: " + error,
    });
    if (error instanceof Error) {
      crashlytics().recordError(error);
    }
    throw error;
  }
};

export const insertSavedEvent:
  (date: Date, description: string, firestoreDocumentId: string | undefined, imageUrl: string, isUserEvent: boolean, latitude: number, longitude: number, title: string) => Promise<unknown> = async (
    date: Date,
    description: string,
    firestoreDocumentId: string | undefined,
    imageUrl: string,
    isUserEvent: boolean,
    latitude: number,
    longitude: number,
    title: string
  ) => {
    try {
      const database = await getDatabase();
      const result = await database.runAsync(
        `INSERT INTO savedEvents (date, description, firestoreDocumentId, imageUrl, isUserEvent, latitude, longitude, title) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [String(date), description, firestoreDocumentId ? firestoreDocumentId : null, imageUrl, Number(isUserEvent), latitude, longitude, title]
      );
      analytics().logEvent("custom_log", {
        description: "--- Analytics: helpers -> sqlite_db -> insertSavedEvent -> (transaction, result), result: " + result,
      });
      return result;
    } catch (error: unknown) {
      analytics().logEvent("custom_log", {
        description: "--- Analytics: helpers -> sqlite_db -> insertSavedEvent -> (transaction, error), error: " + error,
      });
      if (error instanceof Error) {
        crashlytics().recordError(error);
      }
      throw error;
    }
  };

export const fetchSavedEvents: () => Promise<unknown> = async () => {
  try {
    const database = await getDatabase();
    const rows = await database.getAllAsync("SELECT * FROM savedEvents");
    const result = { rows: { _array: rows } };
    analytics().logEvent("custom_log", {
      description: "--- Analytics: helpers -> sqlite_db -> fetchSavedEvents -> (transaction, result), result: " + result,
    });
    return result;
  } catch (error: unknown) {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: helpers -> sqlite_db -> fetchSavedEvents -> (transaction, error), error: " + error,
    });
    if (error instanceof Error) {
      crashlytics().recordError(error);
    }
    throw error;
  }
};
