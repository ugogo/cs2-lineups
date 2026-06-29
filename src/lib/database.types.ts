export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      lineups: {
        Row: {
          aim_image_url: string;
          created_at: string;
          grenade_type: string;
          id: string;
          map_id: string;
          notes: string | null;
          position_image_url: string;
          side: string;
          site: string | null;
          throw_method: string;
          title: string;
        };
        Insert: {
          aim_image_url: string;
          created_at?: string;
          grenade_type: string;
          id?: string;
          map_id: string;
          notes?: string | null;
          position_image_url: string;
          side: string;
          site?: string | null;
          throw_method: string;
          title: string;
        };
        Update: {
          aim_image_url?: string;
          created_at?: string;
          grenade_type?: string;
          id?: string;
          map_id?: string;
          notes?: string | null;
          position_image_url?: string;
          side?: string;
          site?: string | null;
          throw_method?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lineups_map_id_fkey";
            columns: ["map_id"];
            isOneToOne: false;
            referencedRelation: "maps";
            referencedColumns: ["id"];
          },
        ];
      };
      maps: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
