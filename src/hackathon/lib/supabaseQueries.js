/* supabaseQueries.js — fetch/subscribe with mock fallback */
import { supabase } from "./supabase";
import { HACKS, TEAM } from "../mockData";

export async function fetchHackathons() {
  if (!supabase) return HACKS;
  const { data, error } = await supabase.from("hackathons").select("*");
  return error ? HACKS : data;
}

export async function fetchTeam() {
  if (!supabase) return TEAM;
  const { data, error } = await supabase.from("profiles").select("*");
  return error ? TEAM : data;
}

export function subscribeToHackathon(hackathonId, onUpdate) {
  if (!supabase) return () => {};
  const channel = supabase
    .channel(`hackathon:${hackathonId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "hackathons", filter: `id=eq.${hackathonId}` }, onUpdate)
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export function subscribeToMessages(hackathonId, onMessage) {
  if (!supabase) return () => {};
  const channel = supabase
    .channel(`messages:${hackathonId}`)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "hackathon_messages", filter: `hackathon_id=eq.${hackathonId}` }, (payload) => onMessage(payload.new))
    .subscribe();
  return () => supabase.removeChannel(channel);
}
