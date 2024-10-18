import { createClient } from "@supabase/supabase-js";
import { observable } from "@legendapp/state";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { configureSynced } from "@legendapp/state/sync";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Provide a function to generate ids locally
const generateId = () => uuidv4();

// Create a configured sync function
const customSynced = configureSynced(syncedSupabase, {
  persist: {
    plugin: ObservablePersistLocalStorage,
  },
  generateId,
  supabase,
  changesSince: "last-sync",
  fieldCreatedAt: "created_at",
  fieldUpdatedAt: "updated_at",
  fieldDeleted: "deleted",
});

// Users observable
export const users$ = observable(
  customSynced({
    supabase,
    collection: "users",
    select: (from) =>
      from.select("id,name,email,created_at,updated_at,deleted"),
    actions: ["read", "create", "update", "delete"],
    realtime: true,
    persist: {
      name: "users",
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
);

// Fitmates observable
export const fitmates$ = observable(
  customSynced({
    supabase,
    collection: "fitmates",
    select: (from) =>
      from.select("id,user_id,fitmate_id,created_at,updated_at,deleted"),
    actions: ["read", "create", "update", "delete"],
    realtime: true,
    persist: {
      name: "fitmates",
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
);

// Workouts observable
export const workouts$ = observable(
  customSynced({
    supabase,
    collection: "workouts",
    select: (from) =>
      from.select("id,user_id,name,duration,created_at,updated_at,deleted"),
    actions: ["read", "create", "update", "delete"],
    realtime: true,
    persist: {
      name: "workouts",
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
);

// Helper functions for workouts
export function addWorkout(userId: string, name: string, duration: number) {
  const id = generateId();
  workouts$[id].assign({
    id,
    user_id: userId,
    name,
    duration,
  });
}

export function updateWorkout(id: string, name: string, duration: number) {
  workouts$[id].assign({
    name,
    duration,
  });
}

export function deleteWorkout(id: string) {
  workouts$[id].delete();
}

// Helper functions for fitmates
export function addFitmate(userId: string, fitmateId: string) {
  const id = generateId();
  fitmates$[id].assign({
    id,
    user_id: userId,
    fitmate_id: fitmateId,
  });
}

export function removeFitmate(id: string) {
  fitmates$[id].delete();
}

// Helper function for users
export function updateUserProfile(id: string, name: string, email: string) {
  users$[id].assign({
    name,
    email,
  });
}