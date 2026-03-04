import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "../lib/supabase";
import type { UserRole } from "@coachflow/api-types";

const INVITE_SCHEME = "coachflow";

export default function IndexScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "auth" | "ready">("loading");

  useEffect(() => {
    const getTokenFromUrl = (url: string | null): string | null => {
      if (!url?.includes(`${INVITE_SCHEME}://invite`)) return null;
      try {
        return new URL(url).searchParams.get("token");
      } catch {
        return null;
      }
    };

    const run = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        const url = await Linking.getInitialURL();
        const token = getTokenFromUrl(url);
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
    run();

    const sub = Linking.addEventListener("url", ({ url }) => {
      const token = getTokenFromUrl(url);
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
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});
