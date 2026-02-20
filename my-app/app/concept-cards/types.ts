import { Profile as SupabaseProfile } from "@/lib/supabase";

export type Profile = SupabaseProfile;

export interface ReplyDisplay {
  id: string | number;
  user_id: string;
  user: string;
  avatar: string;
  message: string;
  time: string;
}

export interface MessageDisplay {
  id: number | string;
  user_id?: string;
  user: string;
  avatar: string;
  message: string;
  time: string;
  likes: number;
  tips: number;
  location?: string;
  image_url?: string | null;
  isHot?: boolean;
  isImportant?: boolean;
  category: string;
  isBusiness?: boolean;
  manual_flag?: string | null;
  replies: ReplyDisplay[];
  replyCount?: number;
}

export type ContentFilterId = "live" | "hot" | "alerts" | "deals";

export interface ContentFilter {
  id: ContentFilterId;
  label: string;
  icon: string;
  isLive?: boolean;
}
