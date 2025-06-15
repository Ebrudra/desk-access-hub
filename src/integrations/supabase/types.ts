export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      access_codes: {
        Row: {
          booking_id: string
          code: string
          created_at: string
          expires_at: string
          id: string
          is_active: boolean
          member_id: string
          qr_code_url: string | null
          updated_at: string
        }
        Insert: {
          booking_id: string
          code: string
          created_at?: string
          expires_at: string
          id?: string
          is_active?: boolean
          member_id: string
          qr_code_url?: string | null
          updated_at?: string
        }
        Update: {
          booking_id?: string
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          member_id?: string
          qr_code_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_codes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_codes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      access_logs: {
        Row: {
          access_method: string | null
          access_time: string | null
          created_at: string | null
          exit_time: string | null
          id: string
          location_details: string | null
          member_id: string | null
          space_id: string | null
        }
        Insert: {
          access_method?: string | null
          access_time?: string | null
          created_at?: string | null
          exit_time?: string | null
          id?: string
          location_details?: string | null
          member_id?: string | null
          space_id?: string | null
        }
        Update: {
          access_method?: string | null
          access_time?: string | null
          created_at?: string | null
          exit_time?: string | null
          id?: string
          location_details?: string | null
          member_id?: string | null
          space_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_logs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_logs_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          attendees: number | null
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          is_recurring: boolean | null
          member_id: string | null
          recurring_pattern: Json | null
          resource_id: string | null
          special_requests: string | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          title: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          attendees?: number | null
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          is_recurring?: boolean | null
          member_id?: string | null
          recurring_pattern?: Json | null
          resource_id?: string | null
          special_requests?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          title?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          attendees?: number | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          is_recurring?: boolean | null
          member_id?: string | null
          recurring_pattern?: Json | null
          resource_id?: string | null
          special_requests?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          title?: string | null
          total_amount?: number | null
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
          {
            foreignKeyName: "bookings_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_integrations: {
        Row: {
          access_token: string | null
          calendar_id: string | null
          created_at: string
          id: string
          last_sync_at: string | null
          provider: string
          provider_account_id: string | null
          refresh_token: string | null
          settings: Json | null
          sync_enabled: boolean | null
          sync_status: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string
          id?: string
          last_sync_at?: string | null
          provider: string
          provider_account_id?: string | null
          refresh_token?: string | null
          settings?: Json | null
          sync_enabled?: boolean | null
          sync_status?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string
          id?: string
          last_sync_at?: string | null
          provider?: string
          provider_account_id?: string | null
          refresh_token?: string | null
          settings?: Json | null
          sync_enabled?: boolean | null
          sync_status?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          html_content: string
          id: string
          is_active: boolean | null
          name: string
          subject: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          html_content: string
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          html_content?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          attended: boolean | null
          event_id: string | null
          id: string
          member_id: string | null
          registered_at: string | null
        }
        Insert: {
          attended?: boolean | null
          event_id?: string | null
          id?: string
          member_id?: string | null
          registered_at?: string | null
        }
        Update: {
          attended?: boolean | null
          event_id?: string | null
          id?: string
          member_id?: string | null
          registered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string | null
          description: string | null
          end_time: string
          event_type: string | null
          id: string
          image_url: string | null
          is_public: boolean | null
          location_details: string | null
          organizer_id: string | null
          price: number | null
          registration_required: boolean | null
          space_id: string | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          end_time: string
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          location_details?: string | null
          organizer_id?: string | null
          price?: number | null
          registration_required?: boolean | null
          space_id?: string | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          location_details?: string | null
          organizer_id?: string | null
          price?: number | null
          registration_required?: boolean | null
          space_id?: string | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          access_code: string | null
          access_hours: Json | null
          created_at: string | null
          end_date: string | null
          id: string
          member_id: string
          membership_status:
            | Database["public"]["Enums"]["membership_status"]
            | null
          membership_tier: Database["public"]["Enums"]["membership_tier"] | null
          monthly_rate: number | null
          rfid_card_id: string | null
          space_id: string | null
          start_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_code?: string | null
          access_hours?: Json | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          member_id: string
          membership_status?:
            | Database["public"]["Enums"]["membership_status"]
            | null
          membership_tier?:
            | Database["public"]["Enums"]["membership_tier"]
            | null
          monthly_rate?: number | null
          rfid_card_id?: string | null
          space_id?: string | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_code?: string | null
          access_hours?: Json | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          member_id?: string
          membership_status?:
            | Database["public"]["Enums"]["membership_status"]
            | null
          membership_tier?:
            | Database["public"]["Enums"]["membership_tier"]
            | null
          monthly_rate?: number | null
          rfid_card_id?: string | null
          space_id?: string | null
          start_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          channel: string
          content: string | null
          created_at: string
          id: string
          notification_type: string
          provider_response: Json | null
          recipient: string
          sent_at: string | null
          status: string | null
          subject: string | null
          user_id: string | null
        }
        Insert: {
          channel: string
          content?: string | null
          created_at?: string
          id?: string
          notification_type: string
          provider_response?: Json | null
          recipient: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          user_id?: string | null
        }
        Update: {
          channel?: string
          content?: string | null
          created_at?: string
          id?: string
          notification_type?: string
          provider_response?: Json | null
          recipient?: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          id: string
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          due_date: string | null
          id: string
          invoice_date: string | null
          invoice_number: string | null
          member_id: string | null
          metadata: Json | null
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          member_id?: string | null
          metadata?: Json | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          member_id?: string | null
          metadata?: Json | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          id: string
          job_title: string | null
          last_name: string | null
          linkedin_url: string | null
          phone: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id: string
          job_title?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          phone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          phone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          amenities: string[] | null
          capacity: number | null
          created_at: string | null
          daily_rate: number | null
          description: string | null
          hourly_rate: number | null
          id: string
          image_url: string | null
          is_available: boolean | null
          location_details: string | null
          name: string
          space_id: string | null
          type: Database["public"]["Enums"]["space_type"]
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          capacity?: number | null
          created_at?: string | null
          daily_rate?: number | null
          description?: string | null
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          location_details?: string | null
          name: string
          space_id?: string | null
          type: Database["public"]["Enums"]["space_type"]
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          capacity?: number | null
          created_at?: string | null
          daily_rate?: number | null
          description?: string | null
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          location_details?: string | null
          name?: string
          space_id?: string | null
          type?: Database["public"]["Enums"]["space_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      spaces: {
        Row: {
          address: string
          amenities: string[] | null
          city: string
          country: string
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          image_url: string | null
          name: string
          operating_hours: Json | null
          phone: string | null
          postal_code: string | null
          timezone: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address: string
          amenities?: string[] | null
          city: string
          country: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          name: string
          operating_hours?: Json | null
          phone?: string | null
          postal_code?: string | null
          timezone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string
          amenities?: string[] | null
          city?: string
          country?: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          name?: string
          operating_hours?: Json | null
          phone?: string | null
          postal_code?: string | null
          timezone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          default_attendees: number | null
          default_duration: number | null
          favorite_resources: string[] | null
          id: string
          notification_settings: Json | null
          preferred_resource_types: string[] | null
          preferred_times: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_attendees?: number | null
          default_duration?: number | null
          favorite_resources?: string[] | null
          id?: string
          notification_settings?: Json | null
          preferred_resource_types?: string[] | null
          preferred_times?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_attendees?: number | null
          default_duration?: number | null
          favorite_resources?: string[] | null
          id?: string
          notification_settings?: Json | null
          preferred_resource_types?: string[] | null
          preferred_times?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
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
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_any_role: {
        Args: {
          _user_id: string
          _roles: Database["public"]["Enums"]["app_role"][]
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "member"
      booking_status: "confirmed" | "pending" | "cancelled" | "completed"
      membership_status: "active" | "inactive" | "suspended" | "pending"
      membership_tier: "basic" | "premium" | "enterprise"
      notification_type: "booking" | "payment" | "event" | "system" | "access"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      resource_type: "meeting_room" | "desk" | "office" | "equipment" | "lounge"
      space_type:
        | "hot_desk"
        | "dedicated_desk"
        | "private_office"
        | "meeting_room"
        | "phone_booth"
        | "event_space"
        | "desk"
        | "office"
        | "equipment"
        | "lounge"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "member"],
      booking_status: ["confirmed", "pending", "cancelled", "completed"],
      membership_status: ["active", "inactive", "suspended", "pending"],
      membership_tier: ["basic", "premium", "enterprise"],
      notification_type: ["booking", "payment", "event", "system", "access"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      resource_type: ["meeting_room", "desk", "office", "equipment", "lounge"],
      space_type: [
        "hot_desk",
        "dedicated_desk",
        "private_office",
        "meeting_room",
        "phone_booth",
        "event_space",
        "desk",
        "office",
        "equipment",
        "lounge",
      ],
    },
  },
} as const
