import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function ClientHomeScreen() {
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CoachFlow</Text>
      <Text style={styles.subtitle}>Client Home</Text>
      <Text style={styles.body}>
        Your workouts and logging will appear here (Phase 5).
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 18, color: "#374151", marginTop: 8 },
  body: { fontSize: 14, color: "#6b7280", marginTop: 16 },
  button: {
    marginTop: 32,
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonText: { color: "#2563eb", fontSize: 14 },
});
