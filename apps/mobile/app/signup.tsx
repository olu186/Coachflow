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
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../lib/supabase";
import type { UserRole } from "@coachflow/api-types";

const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_APP_URL || "http://localhost:3000";

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>CoachFlow</Text>
        <Text style={styles.subtitle}>{inviteToken ? "Join your trainer" : "Create account"}</Text>
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
          placeholder="Email"
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
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24, paddingVertical: 48 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center", marginTop: 4, marginBottom: 24 },
  inviteHint: { fontSize: 13, color: "#666", textAlign: "center", marginBottom: 8 },
  errorBox: { backgroundColor: "#fef2f2", padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { color: "#b91c1c", fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  roleRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  roleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  roleBtnActive: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },
  roleText: { fontSize: 14, color: "#374151" },
  roleTextActive: { color: "#2563eb", fontWeight: "600" },
  button: { backgroundColor: "#2563eb", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { marginTop: 16, alignItems: "center" },
  linkText: { color: "#2563eb", fontSize: 14 },
});
