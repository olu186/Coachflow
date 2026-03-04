import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "../lib/supabase";
import type { UserRole } from "@coachflow/api-types";

const INVITE_SCHEME = "coachflow";

function getInviteTokenFromUrl(url: string | null): string | null {
  if (!url?.includes(`${INVITE_SCHEME}://invite`)) return null;
  try {
    return new URL(url).searchParams.get("token");
  } catch {
    return null;
  }
}

function parseAuthCallbackUrl(url: string | null): { access_token?: string; refresh_token?: string } | null {
  if (!url?.includes("auth/callback")) return null;
  try {
    const u = new URL(url);
    const hash = u.hash?.slice(1);
    if (!hash) return null;
    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    if (access_token && refresh_token) return { access_token, refresh_token };
    return null;
  } catch {
    return null;
  }
}

export default function IndexScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "auth" | "ready">("loading");

  useEffect(() => {
    const run = async (initialUrl: string | null) => {
      const authParams = parseAuthCallbackUrl(initialUrl);
      if (authParams) {
        const { error } = await supabase.auth.setSession({
          access_token: authParams.access_token!,
          refresh_token: authParams.refresh_token!,
        });
        if (!error) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: profile } = (await supabase
              .from("profiles")
              .select("role")
              .eq("id", session.user.id)
              .single()) as { data: { role: UserRole } | null };
            const role = profile?.role ?? "client";
            setStatus("ready");
            if (role === "trainer") router.replace("/trainer-web");
            else router.replace("/home");
            return;
          }
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        const url = initialUrl ?? (await Linking.getInitialURL());
        const token = getInviteTokenFromUrl(url);
        setStatus("auth");
        if (token) {
          router.replace({ pathname: "/signup", params: { token } });
        } else {
          router.replace("/login");
        }
        return;
      }
      const { data: profile } = (await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()) as { data: { role: UserRole } | null };
      const role = profile?.role ?? "client";
      setStatus("ready");
      if (role === "trainer") {
        router.replace("/trainer-web");
      } else {
        router.replace("/home");
      }
    };

    Linking.getInitialURL().then((url) => run(url));

    const sub = Linking.addEventListener("url", async ({ url }) => {
      const authParams = parseAuthCallbackUrl(url);
      if (authParams) {
        await supabase.auth.setSession({
          access_token: authParams.access_token!,
          refresh_token: authParams.refresh_token!,
        });
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = (await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()) as { data: { role: UserRole } | null };
          const role = profile?.role ?? "client";
          if (role === "trainer") router.replace("/trainer-web");
          else router.replace("/home");
        }
        return;
      }
      const token = getInviteTokenFromUrl(url);
      if (token) router.replace({ pathname: "/signup", params: { token } });
    });
    return () => sub.remove();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Loading…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#0a0a0a",
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#9ca3af",
  },
});
