import { supabase } from "../supabase/client";

export type Experience = {
  id: string;
  title: string | null;
  description: string | null;
  organizer_id: string | null;
  user_id: string | null;
  location: string | null;
  date: string | null; // date
  post_type: string | null;
  created_at: string | null;
  updated_at: string | null;
  organizer_name: string | null;
};

export const getExperienceById = async (id: string) => {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", id)
    .maybeSingle<Experience>();
  return { data, error };
};
