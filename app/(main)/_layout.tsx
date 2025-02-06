import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Accueil" }} />

      <Stack.Screen name="add" options={{ title: "Ajouter un repas" }} />

      <Stack.Screen name="[id]" options={{ title: "Détail du repas" }} />

      <Stack.Screen name="profile" options={{ title: "Profil" }} />
    </Stack>
  );
}
