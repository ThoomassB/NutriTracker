import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useMeals } from "../../context/MealsContext";
import * as ImagePicker from "expo-image-picker";

const appId = process.env.EXPO_PUBLIC_API_EDAMAN_ID!;
const appKey = process.env.EXPO_PUBLIC_API_EDAMAN_KEY!;

if (!appId) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_EDAMAM_API_ID in your .env"
    );
  }

  if (!appKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_EDAMAM_API_KEY in your .env"
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

  const fetchRecipes = async (query: string) => {
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
      Alert.alert("Succès", "Repas ajouté avec succès !");
      router.push("/");
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
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

  const addFoodMeal = async (item: any) => {
    setSelectedFoods([...selectedFoods, item]);
};

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom du repas"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Rechercher un aliment"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Rechercher" onPress={() => fetchRecipes(query)} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>Ajouter une photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imagePicker} onPress={takePhoto}>
          <Text style={styles.imagePickerText}>Prendre une photo</Text>
        </TouchableOpacity>
      </View>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Ajouter" onPress={handleAddMeal} />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 16 }}> Nombre d'aliments : {selectedFoods.length}</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.food.foodId}
        renderItem={({ item }) => (
            <TouchableOpacity onPress={() => addFoodMeal(item)} style={styles.resultItem}>
                <Image source={{ uri: item.food.image }} style={styles.resultImage} />
                <View style={styles.resultTextContainer}>
                    <Text style={styles.resultText}>{item.food.label}</Text>
                    <Text style={styles.resultSubText}>{item.food.nutrients.ENERC_KCAL} KCAL</Text>
                </View>
            </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AddMealScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  imagePicker: {
    backgroundColor: "#87CEEB",
    padding: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  imagePickerText: {
    color: "white",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 12,
    alignSelf: "center",
  },
  resultItem: {
    flexDirection: 'row', // Ajouté pour aligner le texte à côté de l'image
    alignItems: 'center', // Ajouté pour centrer verticalement le texte par rapport à l'image
    padding: 10,
    marginVertical: 8, // Ajouté pour ajouter un espace vertical entre les éléments
    backgroundColor: '#fff', // Ajouté pour un fond blanc
    borderRadius: 8, // Ajouté pour arrondir les coins
    shadowColor: '#000', // Ajouté pour l'ombre
    shadowOffset: { width: 0, height: 2 }, // Ajouté pour l'ombre
    shadowOpacity: 0.1, // Ajouté pour l'ombre
    shadowRadius: 8, 
    elevation: 2, 
},
resultImage: {
    width: 50,
    height: 50,
    borderRadius: 8, 
    marginRight: 10,
},
resultTextContainer: {
    flex: 1,
},
resultText: {
    fontSize: 16,
    fontWeight: 'bold',
},Ò
resultSubText: {
    fontSize: 14,
    color: 'gray',
},
});
