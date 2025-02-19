import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { supabase } from "../src/supabase";
import AddCard from "./components/AddCard";

const App = () => {
  interface Carte {
    id: number;
    nom: string;
    numero: string;
  }

  const [cartes, setCartes] = useState<Carte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})/g, '$1 ').trim();
  };

  useEffect(() => {
    fetchCartes();
  }, []);

  const fetchCartes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("carte").select("*");

      if (error) {
        console.error("❌ Erreur Supabase :", error.message);
        setError(error.message);
      } else {
        console.log("✅ Données récupérées :", data);
        setCartes(data);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la récupération des cartes.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (id: number) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this card?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase.from("carte").delete().eq("id", id);

              if (error) {
                console.error("❌ Erreur de suppression :", error.message);
                Alert.alert("Error", "Failed to delete the card. Please try again.");
              } else {
                console.log("✅ Carte supprimée !");
                setCartes(prevCartes => prevCartes.filter(carte => carte.id !== id));
                Alert.alert("Success", "Card deleted successfully.");
              }
            } catch (err) {
              console.error("❌ Unexpected error:", err);
              Alert.alert("Error", "An unexpected error occurred while deleting the card.");
            }
          }
        }
      ]
    );
  };

  const handleCardAdded = () => {
    setShowAddCard(false);
    fetchCartes();
  };

  const renderCard = ({ item }: { item: Carte }) => (
    <View style={styles.card}>
      <View style={styles.cardInner}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardType}>{item.nom}</Text>
          <View style={styles.chipIcon} />
        </View>
        <Text style={styles.cardNumber}>{formatCardNumber(item.numero)}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardLabel}>VALID THRU</Text>
          <Text style={styles.cardDate}>12/25</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteCard(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Banking Cards</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddCard(true)}
      >
        <Text style={styles.addButtonText}>+ Add New Card</Text>
      </TouchableOpacity>
      
      {showAddCard && <AddCard onCardAdded={handleCardAdded} />}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading your cards...</Text>
        </View>
      ) : cartes.length > 0 ? (
        <FlatList
          data={cartes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No cards found</Text>
          <Text style={styles.emptySubtext}>Add a new card to get started</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    marginTop: 40,
  },
  card: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardInner: {
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  chipIcon: {
    width: 40,
    height: 30,
    backgroundColor: '#FFD700',
    borderRadius: 6,
  },
  cardNumber: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: 2,
    marginTop: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  cardLabel: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '500',
  },
  cardDate: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4B5563',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default App;