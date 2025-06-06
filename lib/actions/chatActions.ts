import { createClient } from "@/lib/supabase/client";


export const newChat = async () => {
  const supabase = createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("Must be logged in to create new chat");
    return;
  }

  const { data, error } = await supabase
    .from("chats")
    .insert([
      {
        user_id: user.id,
        title: "Untitled Chat",
      },
    ])
    .select()
    .single();
  if (error) {
    console.error("Error creating chat:", error.message);
  }

  return data || null;
};

export const getChat = async (chatId : string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching chat:", error.message);
  }

  return data || [];
};


export const getChatList = async (user: { id: string }) => {
  const supabase = createClient();

  if (!user) {
    console.log("No user is logged in. Please log in to fetch chat list.");
    return [];
  }

  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching chat list:", error.message);
    return [];
  }

  return data || [];
};

export const deleteChat = async (chatId: string) => {
  const supabase = createClient();

  if (!chatId) {
    console.log("No chat ID provided. Cannot delete chat.");
    return;
  }

  const { error } = await supabase
    .from("chats")
    .delete()
    .eq("id", chatId);

  if (error) {
    console.error("Error deleting chat:", error.message);
    return false;
  }

  console.log(`Chat with ID ${chatId} deleted successfully.`);
  return true;
}