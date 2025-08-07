export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          read_time: number | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          author_name: string
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          author_name?: string
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          booking_type: string
          created_at: string | null
          description: string | null
          end_datetime: string
          id: string
          member_id: string | null
          notes: string | null
          resource_name: string
          resource_type: string
          start_datetime: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          booking_type: string
          created_at?: string | null
          description?: string | null
          end_datetime: string
          id?: string
          member_id?: string | null
          notes?: string | null
          resource_name: string
          resource_type: string
          start_datetime: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          booking_type?: string
          created_at?: string | null
          description?: string | null
          end_datetime?: string
          id?: string
          member_id?: string | null
          notes?: string | null
          resource_name?: string
          resource_type?: string
          start_datetime?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      cell_memberships: {
        Row: {
          cell_id: string | null
          id: string
          joined_at: string | null
          member_id: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          cell_id?: string | null
          id?: string
          joined_at?: string | null
          member_id?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          cell_id?: string | null
          id?: string
          joined_at?: string | null
          member_id?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cell_memberships_cell_id_fkey"
            columns: ["cell_id"]
            isOneToOne: false
            referencedRelation: "cells"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cell_memberships_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      cells: {
        Row: {
          co_leader_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          leader_id: string | null
          location: string | null
          max_members: number | null
          meeting_day: string | null
          meeting_time: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          co_leader_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          leader_id?: string | null
          location?: string | null
          max_members?: number | null
          meeting_day?: string | null
          meeting_time?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          co_leader_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          leader_id?: string | null
          location?: string | null
          max_members?: number | null
          meeting_day?: string | null
          meeting_time?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cells_co_leader_id_fkey"
            columns: ["co_leader_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cells_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      communications: {
        Row: {
          communication_type: string
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          target_audience: string
          target_group_ids: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          communication_type: string
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          target_audience: string
          target_group_ids?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          communication_type?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          target_audience?: string
          target_group_ids?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          is_replied: boolean | null
          message: string
          message_type: string | null
          name: string
          notes: string | null
          phone: string | null
          replied_at: string | null
          replied_by: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          is_replied?: boolean | null
          message: string
          message_type?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          replied_at?: string | null
          replied_by?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          is_replied?: boolean | null
          message?: string
          message_type?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          replied_at?: string | null
          replied_by?: string | null
          subject?: string
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          attendance_percentage: number | null
          certificate_issued: boolean | null
          completion_date: string | null
          course_id: string | null
          enrollment_date: string | null
          grade: number | null
          id: string
          member_id: string | null
          status: string | null
        }
        Insert: {
          attendance_percentage?: number | null
          certificate_issued?: boolean | null
          completion_date?: string | null
          course_id?: string | null
          enrollment_date?: string | null
          grade?: number | null
          id?: string
          member_id?: string | null
          status?: string | null
        }
        Update: {
          attendance_percentage?: number | null
          certificate_issued?: boolean | null
          completion_date?: string | null
          course_id?: string | null
          enrollment_date?: string | null
          grade?: number | null
          id?: string
          member_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          campaign_name: string | null
          created_at: string | null
          donation_date: string | null
          donation_type: string | null
          id: string
          is_recurring: boolean | null
          member_id: string | null
          notes: string | null
          payment_method: string | null
          recurring_frequency: string | null
          stripe_payment_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          campaign_name?: string | null
          created_at?: string | null
          donation_date?: string | null
          donation_type?: string | null
          id?: string
          is_recurring?: boolean | null
          member_id?: string | null
          notes?: string | null
          payment_method?: string | null
          recurring_frequency?: string | null
          stripe_payment_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          campaign_name?: string | null
          created_at?: string | null
          donation_date?: string | null
          donation_type?: string | null
          id?: string
          is_recurring?: boolean | null
          member_id?: string | null
          notes?: string | null
          payment_method?: string | null
          recurring_frequency?: string | null
          stripe_payment_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          event_id: string
          id: string
          notes: string | null
          registered_at: string
          status: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          notes?: string | null
          registered_at?: string
          status?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          notes?: string | null
          registered_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          event_date: string
          event_type: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_paid: boolean | null
          is_recurring: boolean | null
          location: string | null
          max_participants: number | null
          price: number | null
          recurring_pattern: string | null
          registration_required: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_date: string
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_paid?: boolean | null
          is_recurring?: boolean | null
          location?: string | null
          max_participants?: number | null
          price?: number | null
          recurring_pattern?: string | null
          registration_required?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_date?: string
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_paid?: boolean | null
          is_recurring?: boolean | null
          location?: string | null
          max_participants?: number | null
          price?: number | null
          recurring_pattern?: string | null
          registration_required?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          address: string | null
          baptism_date: string | null
          birth_date: string | null
          confirmation_date: string | null
          created_at: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          id: string
          member_since: string | null
          member_status: string | null
          notes: string | null
          phone: string | null
          photo_url: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          baptism_date?: string | null
          birth_date?: string | null
          confirmation_date?: string | null
          created_at?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          id?: string
          member_since?: string | null
          member_status?: string | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          baptism_date?: string | null
          birth_date?: string | null
          confirmation_date?: string | null
          created_at?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          id?: string
          member_since?: string | null
          member_status?: string | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ministries: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          leader_email: string | null
          leader_name: string | null
          leader_phone: string | null
          location: string | null
          meeting_day: string | null
          meeting_time: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          leader_email?: string | null
          leader_name?: string | null
          leader_phone?: string | null
          location?: string | null
          meeting_day?: string | null
          meeting_time?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          leader_email?: string | null
          leader_name?: string | null
          leader_phone?: string | null
          location?: string | null
          meeting_day?: string | null
          meeting_time?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      ministry_memberships: {
        Row: {
          id: string
          joined_at: string
          ministry_id: string
          role: string | null
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          ministry_id: string
          role?: string | null
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          ministry_id?: string
          role?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ministry_memberships_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
        ]
      }
      ministry_schedules: {
        Row: {
          created_at: string | null
          id: string
          ministry_id: string | null
          notes: string | null
          role: string | null
          service_date: string
          service_time: string | null
          status: string | null
          updated_at: string | null
          volunteer_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ministry_id?: string | null
          notes?: string | null
          role?: string | null
          service_date: string
          service_time?: string | null
          status?: string | null
          updated_at?: string | null
          volunteer_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ministry_id?: string | null
          notes?: string | null
          role?: string | null
          service_date?: string
          service_time?: string | null
          status?: string | null
          updated_at?: string | null
          volunteer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ministry_schedules_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ministry_schedules_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sermons: {
        Row: {
          audio_url: string | null
          biblical_text: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_featured: boolean | null
          notes: string | null
          preacher_name: string
          series_name: string | null
          sermon_date: string
          tags: string[] | null
          title: string
          updated_at: string
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          audio_url?: string | null
          biblical_text?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_featured?: boolean | null
          notes?: string | null
          preacher_name: string
          series_name?: string | null
          sermon_date: string
          tags?: string[] | null
          title: string
          updated_at?: string
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          audio_url?: string | null
          biblical_text?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_featured?: boolean | null
          notes?: string | null
          preacher_name?: string
          series_name?: string | null
          sermon_date?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          availability_days: string[] | null
          background_check_date: string | null
          created_at: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          hours_served: number | null
          id: string
          is_active: boolean | null
          member_id: string | null
          ministry_preferences: string[] | null
          skills: string[] | null
          training_completed: boolean | null
          updated_at: string | null
        }
        Insert: {
          availability_days?: string[] | null
          background_check_date?: string | null
          created_at?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          hours_served?: number | null
          id?: string
          is_active?: boolean | null
          member_id?: string | null
          ministry_preferences?: string[] | null
          skills?: string[] | null
          training_completed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          availability_days?: string[] | null
          background_check_date?: string | null
          created_at?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          hours_served?: number | null
          id?: string
          is_active?: boolean | null
          member_id?: string | null
          ministry_preferences?: string[] | null
          skills?: string[] | null
          training_completed?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: { title: string }
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      promote_user_to_admin: {
        Args: { target_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "user"
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
      user_role: ["admin", "user"],
    },
  },
} as const
