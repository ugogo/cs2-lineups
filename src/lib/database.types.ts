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
          source_type: string;
          source_url: string | null;
          tags: string[];
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
          source_type?: string;
          source_url?: string | null;
          tags?: string[];
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
          source_type?: string;
          source_url?: string | null;
          tags?: string[];
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
      collections: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      collection_lineups: {
        Row: {
          collection_id: string;
          lineup_id: string;
          sort_order: number;
        };
        Insert: {
          collection_id: string;
          lineup_id: string;
          sort_order?: number;
        };
        Update: {
          collection_id?: string;
          lineup_id?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "collection_lineups_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_lineups_lineup_id_fkey";
            columns: ["lineup_id"];
            isOneToOne: false;
            referencedRelation: "lineups";
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
