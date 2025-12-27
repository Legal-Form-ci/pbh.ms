export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      contact_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone: string
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          country: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          region: string
          source: string | null
        }
        Insert: {
          country?: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          phone: string
          region: string
          source?: string | null
        }
        Update: {
          country?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          region?: string
          source?: string | null
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          budget_range: string | null
          completion_date: string | null
          created_at: string
          description: string
          duration_months: number | null
          id: string
          image_url: string | null
          location: string
          project_type: string
          status: string | null
          surface_area: number | null
          title: string
        }
        Insert: {
          budget_range?: string | null
          completion_date?: string | null
          created_at?: string
          description: string
          duration_months?: number | null
          id?: string
          image_url?: string | null
          location: string
          project_type: string
          status?: string | null
          surface_area?: number | null
          title: string
        }
        Update: {
          budget_range?: string | null
          completion_date?: string | null
          created_at?: string
          description?: string
          duration_months?: number | null
          id?: string
          image_url?: string | null
          location?: string
          project_type?: string
          status?: string | null
          surface_area?: number | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_documents: {
        Row: {
          created_at: string
          document_type: string
          file_url: string
          id: string
          name: string
          project_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          file_url: string
          id?: string
          name: string
          project_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          file_url?: string
          id?: string
          name?: string
          project_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_updates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          progress_percentage: number | null
          project_id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          progress_percentage?: number | null
          project_id: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          progress_percentage?: number | null
          project_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_completion_date: string | null
          client_id: string
          construction_progress: number | null
          construction_status: string | null
          created_at: string
          description: string | null
          escrow_account_status: string | null
          escrow_amount: number | null
          escrow_bank: string | null
          estimated_budget: number | null
          estimated_completion_date: string | null
          expert_validation_date: string | null
          expert_validation_status: string | null
          id: string
          keys_delivered_date: string | null
          location: string
          project_type: string
          quality_level: string
          start_date: string | null
          surface_area: number
          title: string
          updated_at: string
        }
        Insert: {
          actual_completion_date?: string | null
          client_id: string
          construction_progress?: number | null
          construction_status?: string | null
          created_at?: string
          description?: string | null
          escrow_account_status?: string | null
          escrow_amount?: number | null
          escrow_bank?: string | null
          estimated_budget?: number | null
          estimated_completion_date?: string | null
          expert_validation_date?: string | null
          expert_validation_status?: string | null
          id?: string
          keys_delivered_date?: string | null
          location: string
          project_type: string
          quality_level: string
          start_date?: string | null
          surface_area: number
          title: string
          updated_at?: string
        }
        Update: {
          actual_completion_date?: string | null
          client_id?: string
          construction_progress?: number | null
          construction_status?: string | null
          created_at?: string
          description?: string | null
          escrow_account_status?: string | null
          escrow_amount?: number | null
          escrow_bank?: string | null
          estimated_budget?: number | null
          estimated_completion_date?: string | null
          expert_validation_date?: string | null
          expert_validation_status?: string | null
          id?: string
          keys_delivered_date?: string | null
          location?: string
          project_type?: string
          quality_level?: string
          start_date?: string | null
          surface_area?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      simulations: {
        Row: {
          client_id: string | null
          converted_to_project_id: string | null
          created_at: string
          estimated_budget: number | null
          estimated_construction_months: number | null
          id: string
          lead_id: string | null
          loan_amount: number | null
          loan_duration_months: number | null
          location: string
          monthly_payment: number | null
          project_type: string
          quality_level: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          surface_area: number
        }
        Insert: {
          client_id?: string | null
          converted_to_project_id?: string | null
          created_at?: string
          estimated_budget?: number | null
          estimated_construction_months?: number | null
          id?: string
          lead_id?: string | null
          loan_amount?: number | null
          loan_duration_months?: number | null
          location: string
          monthly_payment?: number | null
          project_type: string
          quality_level: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          surface_area: number
        }
        Update: {
          client_id?: string | null
          converted_to_project_id?: string | null
          created_at?: string
          estimated_budget?: number | null
          estimated_construction_months?: number | null
          id?: string
          lead_id?: string | null
          loan_amount?: number | null
          loan_duration_months?: number | null
          location?: string
          monthly_payment?: number | null
          project_type?: string
          quality_level?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          surface_area?: number
        }
        Relationships: [
          {
            foreignKeyName: "simulations_converted_to_project_id_fkey"
            columns: ["converted_to_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "client"],
    },
  },
} as const
