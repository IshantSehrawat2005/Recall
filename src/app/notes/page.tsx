import NotesPage from "@/components/notes-page";
import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";

export default async function Notes() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in?next=/notes");
  }
  return <NotesPage user={user} />;
}
