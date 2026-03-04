/**
 * Shared database and API types for CoachFlow.
 * Keep in sync with Supabase schema (supabase/migrations).
 */

export type UserRole = "trainer" | "client";

export interface Profile {
  id: string;
  role: UserRole;
  name: string | null;
  email: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Trainer {
  id: string;
  user_id: string;
  business_name: string | null;
  subscription_plan: string | null;
  stripe_customer_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ClientInvite {
  id: string;
  trainer_id: string;
  email: string;
  token: string;
  expires_at: string;
  created_at?: string;
}

export interface Client {
  id: string;
  user_id: string;
  trainer_id: string;
  status: string;
  start_date: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutExercise {
  name: string;
  sets?: number;
  reps?: string;
  weight?: string;
  notes?: string;
}

export interface Workout {
  id: string;
  trainer_id: string;
  title: string;
  exercises: WorkoutExercise[];
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutAssignment {
  id?: string;
  workout_id: string;
  client_id: string;
  week_start: string;
  created_at?: string;
}

export interface WorkoutLog {
  id?: string;
  client_id: string;
  exercise_name: string;
  reps: number | null;
  weight: number | null;
  completed_at: string;
  workout_id?: string;
  assignment_id?: string;
  created_at?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "id">; Update: Partial<Profile> };
      trainers: { Row: Trainer; Insert: Omit<Trainer, "id">; Update: Partial<Trainer> };
      client_invites: { Row: ClientInvite; Insert: Omit<ClientInvite, "id">; Update: Partial<ClientInvite> };
      clients: { Row: Client; Insert: Omit<Client, "id">; Update: Partial<Client> };
      workouts: { Row: Workout; Insert: Omit<Workout, "id">; Update: Partial<Workout> };
      workout_assignments: {
        Row: WorkoutAssignment & { id: string };
        Insert: Omit<WorkoutAssignment, "id">;
        Update: Partial<WorkoutAssignment>;
      };
      workout_logs: { Row: WorkoutLog; Insert: Omit<WorkoutLog, "id">; Update: Partial<WorkoutLog> };
    };
  };
}
