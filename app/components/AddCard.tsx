import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { supabase } from "../../src/supabase";

const AddCard = ({ onCardAdded }: { onCardAdded: () => void }) => {
  const [nom, setNom] = useState("");
  const [numero, setNumero] = useState("");

  const handleAddCard = async () => {
    if (!nom || !numero) {
      Alert.alert("Erreur", "Tous les champs sont requis !");
      return;
    }

    const { error } = await supabase.from("carte").insert([{ nom, numero }]);

    if (error) {
      Alert.alert("Erreur", error.message);
    } else {
      Alert.alert("Succès", "Carte ajoutée avec succès !");
      setNom("");
      setNumero("");
      onCardAdded();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter une carte</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nom de la carte"
          value={nom}
          onChangeText={setNom}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Numéro de carte"
          value={numero}
          onChangeText={setNumero}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />

        <TouchableOpacity style={styles.button} onPress={handleAddCard}>
          <Text style={styles.buttonText}>Ajouter la carte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 16,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  formContainer: {
    gap: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
    color: "#333",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AddCard;
