export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          email: string | null;
          address: string | null;
          source: "google" | "referral" | "workshop" | "direct" | "other";
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contacts"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["contacts"]["Insert"]>;
      };
      cases: {
        Row: {
          id: string;
          contact_id: string;
          case_number: string;
          title: string;
          case_type: "vehicle_damage" | "property_damage" | "ecs" | "other";
          insurer: string | null;
          claim_number: string | null;
          vehicle_plate: string | null;
          vin: string | null;
          event_date: string | null;
          status: "new" | "in_progress" | "waiting" | "closed";
          priority: "low" | "normal" | "high" | "urgent";
          summary: string | null;
          created_at: string;
          updated_at: string;
          closed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["cases"]["Row"], "id" | "created_at" | "updated_at" | "closed_at">;
        Update: Partial<Database["public"]["Tables"]["cases"]["Insert"] & { closed_at: string | null }>;
      };
      tasks: {
        Row: {
          id: string;
          contact_id: string | null;
          case_id: string | null;
          title: string;
          description: string | null;
          due_date: string;
          due_time: string | null;
          status: "open" | "done";
          priority: "low" | "normal" | "high" | "urgent";
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["tasks"]["Row"], "id" | "created_at" | "updated_at" | "completed_at">;
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"] & { completed_at: string | null }>;
      };
      notes: {
        Row: {
          id: string;
          contact_id: string | null;
          case_id: string | null;
          content: string;
          note_type: "general" | "phone_call" | "email" | "insurer_update" | "client_update" | "internal";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notes"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["notes"]["Insert"]>;
      };
      documents: {
        Row: {
          id: string;
          contact_id: string | null;
          case_id: string | null;
          file_name: string;
          file_path: string;
          file_type: string | null;
          category: "invoice" | "insurer_letter" | "photo" | "estimate" | "contract" | "other";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["documents"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["documents"]["Insert"]>;
      };
    };
  };
}
