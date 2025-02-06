import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Avatar, Button, Card } from "react-native-paper";

const Profile = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Se déconnecter",
          onPress: () => signOut(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Avatar.Image
            size={80}
            source={{ uri: user?.imageUrl || "https://via.placeholder.com/80" }}
          />
          <Text style={styles.name}>{user?.fullName || "Utilisateur"}</Text>
          <Text style={styles.email}>{user?.emailAddresses[0]?.emailAddress}</Text>
        </View>

        <Button
          mode="contained"
          onPress={handleSignOut}
          style={styles.button}
          icon="logout"
        >
          Déconnexion
        </Button>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  profileCard: {
    width: "100%",
    maxWidth: 350,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 5, // Ombre pour Android
    shadowColor: "#000", // Ombre pour iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  button: {
    width: "100%",
    borderRadius: 10,
  },
});

export default Profile;