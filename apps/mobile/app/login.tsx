import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

const BRAND_ORANGE = "#E67E22";
const BACKGROUND = "#0a0a0a";
const CARD_BG = "#1a1a1a";
const BORDER = "#333";
const TEXT_PRIMARY = "#ffffff";
const TEXT_MUTED = "#9ca3af";
const QUOTE_GRAY = "#6b7280";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);

  async function handleSendCode() {
    setError(null);
    if (!email.trim()) {
      setError("Enter your email");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: "coachflow://auth/callback",
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setCodeSent(true);
  }

  if (codeSent) {
    return (
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.inner}>
            <Text style={styles.logo}>CoachFlow</Text>
            <Text style={styles.tagline}>Your clients. Your business. Managed.</Text>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.instruction}>
              We sent a sign-in link to {email}. Tap the link in the email to sign in.
            </Text>
            <TouchableOpacity onPress={() => { setCodeSent(false); setError(null); }} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Use a different email</Text>
            </TouchableOpacity>
            <Text style={styles.quote}>"The secret to getting ahead is getting started."</Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inner}>
          <Text style={styles.logo}>CoachFlow</Text>
          <Text style={styles.tagline}>Your clients. Your business. Managed.</Text>

          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.instruction}>Enter your email to receive a sign-in code.</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor={TEXT_MUTED}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendCode}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Sending…" : "SEND CODE"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/signup")} style={styles.link}>
            <Text style={styles.linkText}>No account? Sign up</Text>
          </TouchableOpacity>

          <Text style={styles.quote}>"The secret to getting ahead is getting started."</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BACKGROUND },
  container: { flex: 1, justifyContent: "center", padding: 24 },
  inner: { maxWidth: 400, width: "100%", alignSelf: "center" },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: BRAND_ORANGE,
    letterSpacing: 1,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: "center",
    marginBottom: 40,
  },
  title: { fontSize: 26, fontWeight: "bold", color: TEXT_PRIMARY, marginBottom: 8 },
  instruction: { fontSize: 14, color: TEXT_MUTED, marginBottom: 20 },
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
    marginBottom: 16,
  },
  button: {
    backgroundColor: BRAND_ORANGE,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#000", fontWeight: "700", fontSize: 15, letterSpacing: 0.5 },
  secondaryButton: { alignItems: "center", marginBottom: 32 },
  secondaryButtonText: { color: BRAND_ORANGE, fontSize: 14 },
  link: { alignItems: "center", marginBottom: 24 },
  linkText: { color: BRAND_ORANGE, fontSize: 14 },
  quote: { fontSize: 13, color: QUOTE_GRAY, fontStyle: "italic", textAlign: "center", marginTop: "auto", paddingTop: 24 },
});
