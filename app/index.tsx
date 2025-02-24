import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AddCard from "./components/AddCard";
import { getCartes, deleteCarte, updateCarte } from "./services/api"; // Import des nouvelles méthodes API

function App() {
  interface Carte {
    id: number;
    nom: string;
    numero: string;
  }

  const [cartes, setCartes] = useState<Carte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState<Carte | null>(null);
  const [newNom, setNewNom] = useState("");
  const [newNumero, setNewNumero] = useState("");

  useEffect(() => {
    fetchCartes();
  }, []);

  const fetchCartes = async () => {
    try {
      setLoading(true);
      const data = await getCartes();

      if (!data || data.length === 0) {
        setError("Aucune carte trouvée.");
      } else {
        setCartes(data);
        setError(null);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des cartes :", err);
      setError("Une erreur est survenue lors de la récupération des cartes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardAdded = () => {
    setShowAddCard(false);
    fetchCartes();
  };

  const handleDeleteCard = async (id: number) => {
    Alert.alert("Confirmation", "Voulez-vous vraiment supprimer cette carte ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await deleteCarte(id);
          Alert.alert("Succès", "Carte supprimée avec succès !");
          fetchCartes();
        },
      },
    ]);
  };

  const handleEditCard = async () => {
    if (!newNom || !newNumero) {
      Alert.alert("Erreur", "Tous les champs sont requis !");
      return;
    }

    if (editingCard) {
      await updateCarte(editingCard.id, newNom, newNumero);
      Alert.alert("Succès", "Carte mise à jour !");
      setEditingCard(null);
      setNewNom("");
      setNewNumero("");
      fetchCartes();
    }
  };

  const startEditing = (carte: Carte) => {
    setEditingCard(carte);
    setNewNom(carte.nom);
    setNewNumero(carte.numero);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💳 Mes Cartes Bancaires</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddCard(true)}
      >
        <Text style={styles.addButtonText}>+ Ajouter une carte</Text>
      </TouchableOpacity>

      {showAddCard && <AddCard onCardAdded={handleCardAdded} />}

      {editingCard && (
        <View style={styles.editContainer}>
          <Text style={styles.editTitle}>Modifier la carte</Text>
          <TextInput
            style={styles.input}
            value={newNom}
            onChangeText={setNewNom}
            placeholder="Nom"
            placeholderTextColor="#777"
          />
          <TextInput
            style={styles.input}
            value={newNumero}
            onChangeText={setNewNumero}
            keyboardType="numeric"
            placeholder="Numéro"
            placeholderTextColor="#777"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleEditCard}>
            <Text style={styles.saveButtonText}>✅ Enregistrer</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Chargement des cartes...</Text>
        </View>
      ) : cartes.length > 0 ? (
        <FlatList
          data={cartes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardType}>{item.nom}</Text>
              <Text style={styles.cardNumber}>{item.numero}</Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => startEditing(item)}
                >
                  <Text style={styles.buttonText}>✏ Modifier</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteCard(item.id)}
                >
                  <Text style={styles.buttonText}>🗑 Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune carte enregistrée.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
    marginTop: 40,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#6366F1",
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardType: {
    fontSize: 18,
    fontWeight: "600",
  },
  cardNumber: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  editButton: {
    backgroundColor: "#F59E0B",
    padding: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    padding: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  editContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
  },
  editTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: "#10B981",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default App;
