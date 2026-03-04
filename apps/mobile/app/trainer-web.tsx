import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function TrainerWebScreen() {
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CoachFlow</Text>
      <Text style={styles.subtitle}>Trainer dashboard</Text>
      <Text style={styles.body}>
        Use the CoachFlow web app to manage clients and workouts. This mobile app is for
        clients.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openURL("https://coachflow.vercel.app").catch(() => {})}
      >
        <Text style={styles.buttonText}>Open web dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={handleSignOut}>
        <Text style={styles.linkText}>Sign out</Text>
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
    marginTop: 24,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { marginTop: 16, alignSelf: "center" },
  linkText: { color: "#6b7280", fontSize: 14 },
});
