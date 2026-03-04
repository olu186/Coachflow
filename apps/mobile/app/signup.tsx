import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../lib/supabase";
import type { UserRole } from "@coachflow/api-types";

const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_APP_URL || "http://localhost:3000";

const BRAND_ORANGE = "#E67E22";
const BACKGROUND = "#0a0a0a";
const CARD_BG = "#1a1a1a";
const BORDER = "#333";
const TEXT_PRIMARY = "#ffffff";
const TEXT_MUTED = "#9ca3af";
const QUOTE_GRAY = "#6b7280";

export default function SignupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string }>();
  const inviteToken = params.token ?? null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(!!inviteToken);

  useEffect(() => {
    if (!inviteToken) return;
    const run = async () => {
      try {
        const res = await fetch(`${WEB_APP_URL}/api/invite/validate?token=${encodeURIComponent(inviteToken)}`);
        const data = await res.json();
        if (data.valid && data.email) setEmail(data.email);
      } catch (_) {}
      setInviteLoading(false);
    };
    run();
  }, [inviteToken]);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    const signUpRole = inviteToken ? "client" : role;
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: signUpRole, name: name || undefined } },
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    if (authData.user && signUpRole === "trainer") {
      await (supabase as any).from("trainers").insert({ user_id: authData.user.id });
    }
    if (inviteToken && authData.session) {
      try {
        const acceptRes = await fetch(`${WEB_APP_URL}/api/invite/accept`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: inviteToken, access_token: authData.session.access_token }),
        });
        if (!acceptRes.ok) {
          const err = await acceptRes.json().catch(() => ({}));
          setError(err.error || "Failed to link to trainer");
          setLoading(false);
          return;
        }
      } catch (e) {
        setError("Failed to link to trainer");
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    if (signUpRole === "trainer") router.replace("/trainer-web");
    else router.replace("/home");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>CoachFlow</Text>
          <Text style={styles.tagline}>Your clients. Your business. Managed.</Text>
          <Text style={styles.title}>{inviteToken ? "Join your trainer" : "Create account"}</Text>
          {inviteLoading && (
            <Text style={styles.inviteHint}>Loading invite…</Text>
          )}
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor={TEXT_MUTED}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!inviteToken}
          />
          <TextInput
            style={styles.input}
            placeholder="Password (min 6)"
            placeholderTextColor={TEXT_MUTED}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={TEXT_MUTED}
            value={name}
            onChangeText={setName}
            autoComplete="name"
          />
          {!inviteToken && (
            <View style={styles.roleRow}>
              <TouchableOpacity
                style={[styles.roleBtn, role === "trainer" && styles.roleBtnActive]}
                onPress={() => setRole("trainer")}
              >
                <Text style={[styles.roleText, role === "trainer" && styles.roleTextActive]}>
                  Trainer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleBtn, role === "client" && styles.roleBtnActive]}
                onPress={() => setRole("client")}
              >
                <Text style={[styles.roleText, role === "client" && styles.roleTextActive]}>
                  Client
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Creating…" : "Sign up"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/login")} style={styles.link}>
            <Text style={styles.linkText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
          <Text style={styles.quote}>"The secret to getting ahead is getting started."</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BACKGROUND },
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24, paddingVertical: 48 },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: BRAND_ORANGE,
    letterSpacing: 1,
    marginBottom: 4,
  },
  tagline: { fontSize: 14, color: TEXT_MUTED, textAlign: "center", marginBottom: 24 },
  title: { fontSize: 22, fontWeight: "bold", color: TEXT_PRIMARY, marginBottom: 20 },
  inviteHint: { fontSize: 13, color: TEXT_MUTED, textAlign: "center", marginBottom: 8 },
  errorBox: { backgroundColor: "rgba(220,38,38,0.2)", padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { color: "#fca5a5", fontSize: 14 },
  input: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  roleRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  roleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD_BG,
    alignItems: "center",
  },
  roleBtnActive: { borderColor: BRAND_ORANGE, backgroundColor: "rgba(230,126,34,0.15)" },
  roleText: { fontSize: 14, color: TEXT_MUTED },
  roleTextActive: { color: BRAND_ORANGE, fontWeight: "600" },
  button: {
    backgroundColor: BRAND_ORANGE,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#000", fontWeight: "700", fontSize: 15 },
  link: { alignItems: "center" },
  linkText: { color: BRAND_ORANGE, fontSize: 14 },
  quote: { fontSize: 13, color: QUOTE_GRAY, fontStyle: "italic", textAlign: "center", marginTop: 32 },
});
