import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMeals } from "../../context/MealsContext";

const DetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState<any>(null);
  const router = useRouter();
  const { meals, deleteMeal } = useMeals();

  useEffect(() => {
    const meal = meals.find((meal: any) => meal.id === parseInt(id as string));
    setMeal(meal);
  }, [id, meals]);

  const confirmDelete = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer ce repas ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteMeal(parseInt(id as string));
            Alert.alert("Succès", "Repas supprimé avec succès !");
            router.push("/");
          },
        },
      ]
    );
  };

  if (!meal) {
    return null;
  }

  return (
    <View style={styles.container}>
      {meal.image && (
        <Image source={{ uri: meal.image }} style={styles.mealImage} />
      )}
      <Text style={styles.mealName}>{meal.name}</Text>
      <Text style={styles.label}>Nom : <Text style={styles.value}>{meal?.name}</Text></Text>

      <Text style={styles.label}>Nombre d'aliments : <Text style={styles.value}>{meal?.foods.length}</Text></Text>

      <Text style={styles.label}>Calories : <Text style={styles.value}>{meal?.foods.reduce((acc, food) => acc + food.food.nutrients.ENERC_KCAL, 0)} KCAL</Text></Text>

      <Text style={styles.label}>Protéines : <Text style={styles.value}>{meal?.foods.reduce((acc, food) => acc + food.food.nutrients.PROCNT, 0)} g</Text></Text>

      <Text style={styles.label}>Glucides : <Text style={styles.value}>{meal?.foods.reduce((acc, food) => acc + food.food.nutrients.CHOCDF, 0)} g</Text></Text>

      <Text style={styles.label}>Lipides : <Text style={styles.value}>{meal?.foods.reduce((acc, food) => acc + food.food.nutrients.FAT, 0)} g</Text></Text>

      <FlatList
                data={meal?.foods}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.foodItemContainer}>
                        <Image source={{ uri: item.food.image }} style={styles.foodItemImage} />
                        <View style={styles.foodItemTextContainer}>
                            <Text style={styles.foodItemText}>{item.food.label}</Text>
                        </View>
                    </View>
                )}
            />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={confirmDelete}>
          <Ionicons name="trash" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  mealImage: {
    width: 200,
    height: 200,
    marginBottom: 12,
  },
  mealName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  mealCalories: {
    fontSize: 20,
    color: "#888",
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  foodItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
});

export default DetailScreen;
