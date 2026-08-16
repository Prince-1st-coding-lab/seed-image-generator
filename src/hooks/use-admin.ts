import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdminSession() {
  const [state, setState] = useState<{
    loading: boolean;
    email: string | null;
    isAdmin: boolean;
  }>({ loading: true, email: null, isAdmin: false });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        if (!cancelled) setState({ loading: false, email: null, isAdmin: false });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");
      if (!cancelled)
        setState({
          loading: false,
          email: user.email ?? null,
          isAdmin: (roles ?? []).length > 0,
        });
    };

    void load();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void load();
      }
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
