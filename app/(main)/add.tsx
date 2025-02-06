import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useMeals } from "../../context/MealsContext";
import * as ImagePicker from "expo-image-picker";
import { Button, Card, TextInput, Text } from "react-native-paper";

const appId = process.env.EXPO_PUBLIC_API_EDAMAN_ID!;
const appKey = process.env.EXPO_PUBLIC_API_EDAMAN_KEY!;

if (!appId || !appKey) {
  throw new Error(
    "Il manque les clés API. Vérifiez EXPO_PUBLIC_EDAMAM_API_ID et EXPO_PUBLIC_EDAMAM_API_KEY dans votre .env"
  );
}

const AddMealScreen = () => {
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [image, setImage] = useState<string | null>(null);
  const [selectedFoods, setSelectedFoods] = useState<any[]>([]);
  const router = useRouter();
  const { addMeal } = useMeals();

  const fetchRecipes = async () => {
    if (!query) return;
    const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&app_key=${appKey}&ingr=${query}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setResults(data.hints);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  const handleAddMeal = () => {
    if (name) {
      const newMeal = {
        id: Date.now(),
        name,
        image,
        foods: selectedFoods,
      };
      addMeal(newMeal);
      router.push("/");
    } else {
      alert("Veuillez entrer un nom de repas.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const addFoodMeal = (item: any) => {
    setSelectedFoods([...selectedFoods, item]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Ajouter un repas</Text>

        <TextInput
          label="Nom du repas"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />


        <Button
          mode="contained"
          onPress={handleAddMeal}
          style={styles.addButton}
        >
          Ajouter le repas
        </Button>

        <View style={styles.searchContainer}>
          <TextInput
            label="Rechercher un aliment"
            value={query}
            onChangeText={setQuery}
            mode="outlined"
            style={styles.searchInput}
          />
          <Button mode="contained" onPress={fetchRecipes} style={styles.searchButton}>
            Rechercher
          </Button>
        </View>

        <View style={styles.buttonContainer}>
          <Button icon="image" mode="contained" onPress={pickImage} style={styles.imageButton}>
            Ajouter une photo
          </Button>
          <Button icon="camera" mode="contained" onPress={takePhoto} style={styles.imageButton}>
            Prendre une photo
          </Button>
        </View>

        {image && <Image source={{ uri: image }} style={styles.image} />}

        <Text style={styles.foodCount}>
          Nombre d'aliments sélectionnés : {selectedFoods.length}
        </Text>

        <FlatList
          data={results}
          keyExtractor={(item) => item.food.foodId}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => addFoodMeal(item)}>
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  {item.food.image && (
                    <Image
                      source={{ uri: item.food.image }}
                      style={styles.foodImage}
                    />
                  )}
                  <View>
                    <Text style={styles.foodName}>{item.food.label}</Text>
                    <Text style={styles.foodCalories}>
                      {item.food.nutrients.ENERC_KCAL} KCAL
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddMealScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    width: "100%",
    marginBottom: 12,
  },
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
  },
  searchButton: {
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  imageButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginVertical: 12,
  },
  addButton: {
    width: "100%",
    marginBottom: 16,
  },
  foodCount: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#555",
  },
  card: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  foodCalories: {
    fontSize: 14,
    color: "#888",
  },
});