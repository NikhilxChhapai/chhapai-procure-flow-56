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
      custom_stages: {
        Row: {
          created_at: string
          department: string | null
          display_order: number
          estimated_hours: number | null
          id: string
          is_active: boolean
          stage_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          display_order: number
          estimated_hours?: number | null
          id?: string
          is_active?: boolean
          stage_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          display_order?: number
          estimated_hours?: number | null
          id?: string
          is_active?: boolean
          stage_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      delivery_challans: {
        Row: {
          challan_no: string
          created_at: string | null
          delivery_address: string | null
          delivery_date: string | null
          generated_by: string | null
          id: string
          order_id: string | null
          quantity_delivered: number
        }
        Insert: {
          challan_no: string
          created_at?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          generated_by?: string | null
          id?: string
          order_id?: string | null
          quantity_delivered: number
        }
        Update: {
          challan_no?: string
          created_at?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          generated_by?: string | null
          id?: string
          order_id?: string | null
          quantity_delivered?: number
        }
        Relationships: [
          {
            foreignKeyName: "delivery_challans_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          category: string | null
          created_at: string | null
          current_stock: number
          id: string
          item_name: string
          minimum_stock: number | null
          supplier: string | null
          unit_price: number | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          current_stock?: number
          id?: string
          item_name: string
          minimum_stock?: number | null
          supplier?: string | null
          unit_price?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          current_stock?: number
          id?: string
          item_name?: string
          minimum_stock?: number | null
          supplier?: string | null
          unit_price?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_usage: {
        Row: {
          created_at: string | null
          id: string
          inventory_id: string | null
          order_id: string | null
          quantity_used: number
          stage_name: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_id?: string | null
          order_id?: string | null
          quantity_used: number
          stage_name?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_id?: string | null
          order_id?: string | null
          quantity_used?: number
          stage_name?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_usage_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_stages: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          end_time: string | null
          estimated_time_hours: number | null
          id: string
          notes: string | null
          order_id: string | null
          quality_remarks: string | null
          stage_name: string
          start_time: string | null
          status: Database["public"]["Enums"]["stage_status"] | null
          time_taken_hours: number | null
          updated_at: string | null
          wastage_percentage: number | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          end_time?: string | null
          estimated_time_hours?: number | null
          id?: string
          notes?: string | null
          order_id?: string | null
          quality_remarks?: string | null
          stage_name: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["stage_status"] | null
          time_taken_hours?: number | null
          updated_at?: string | null
          wastage_percentage?: number | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          end_time?: string | null
          estimated_time_hours?: number | null
          id?: string
          notes?: string | null
          order_id?: string | null
          quality_remarks?: string | null
          stage_name?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["stage_status"] | null
          time_taken_hours?: number | null
          updated_at?: string | null
          wastage_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_stages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_contact: string | null
          customer_name: string
          delivery_date: string | null
          id: string
          order_no: string
          order_notes: string | null
          order_total: number
          price_per_unit: number | null
          priority: Database["public"]["Enums"]["order_priority"] | null
          product_name: string
          quantity: number
          shipping_address: string | null
          sku: string | null
          source: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          sub_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_contact?: string | null
          customer_name: string
          delivery_date?: string | null
          id?: string
          order_no: string
          order_notes?: string | null
          order_total: number
          price_per_unit?: number | null
          priority?: Database["public"]["Enums"]["order_priority"] | null
          product_name: string
          quantity: number
          shipping_address?: string | null
          sku?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          sub_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_contact?: string | null
          customer_name?: string
          delivery_date?: string | null
          id?: string
          order_no?: string
          order_notes?: string | null
          order_total?: number
          price_per_unit?: number | null
          priority?: Database["public"]["Enums"]["order_priority"] | null
          product_name?: string
          quantity?: number
          shipping_address?: string | null
          sku?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          sub_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          order_id: string | null
          payment_date: string | null
          payment_method: string | null
          recorded_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          recorded_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          last_name: string | null
          permissions: Json | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          permissions?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          permissions?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      quality_check_reports: {
        Row: {
          checked_by: string | null
          created_at: string | null
          id: string
          order_id: string | null
          remarks: string | null
          stage_name: string
          status: string
          wastage_percentage: number | null
        }
        Insert: {
          checked_by?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          remarks?: string | null
          stage_name: string
          status: string
          wastage_percentage?: number | null
        }
        Update: {
          checked_by?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          remarks?: string | null
          stage_name?: string
          status?: string
          wastage_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quality_check_reports_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      stage_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_type: string | null
          id: string
          order_stage_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_type?: string | null
          id?: string
          order_stage_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_type?: string | null
          id?: string
          order_stage_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stage_attachments_order_stage_id_fkey"
            columns: ["order_stage_id"]
            isOneToOne: false
            referencedRelation: "order_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          created_by: string | null
          credit_limit_amount: number | null
          credit_limit_days: number | null
          email: string | null
          gst_number: string | null
          id: string
          is_active: boolean
          phone: string | null
          product_types: string[] | null
          typical_quantities: string[] | null
          typical_sizes: string[] | null
          updated_at: string
          vendor_name: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          credit_limit_amount?: number | null
          credit_limit_days?: number | null
          email?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          product_types?: string[] | null
          typical_quantities?: string[] | null
          typical_sizes?: string[] | null
          updated_at?: string
          vendor_name: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          credit_limit_amount?: number | null
          credit_limit_days?: number | null
          email?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          product_types?: string[] | null
          typical_quantities?: string[] | null
          typical_sizes?: string[] | null
          updated_at?: string
          vendor_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_permissions: {
        Args: { user_role: Database["public"]["Enums"]["user_role"] }
        Returns: Json
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      order_priority: "normal" | "express"
      order_status: "pending" | "in_progress" | "completed" | "cancelled"
      stage_status: "pending" | "in_progress" | "completed"
      user_role:
        | "admin"
        | "designer"
        | "production"
        | "qc"
        | "purchase"
        | "accounts"
        | "sales"
        | "dispatch"
        | "viewer"
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
      order_priority: ["normal", "express"],
      order_status: ["pending", "in_progress", "completed", "cancelled"],
      stage_status: ["pending", "in_progress", "completed"],
      user_role: [
        "admin",
        "designer",
        "production",
        "qc",
        "purchase",
        "accounts",
        "sales",
        "dispatch",
        "viewer",
      ],
    },
  },
} as const
