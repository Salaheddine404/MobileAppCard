import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getCartes } from "../services/api";

interface Carte {
  id: number;
  nom: string;
  numero: string;
}

const CardItem = () => {
  const [cartes, setCartes] = useState<Carte[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartes = async () => {
    setLoading(true);
    const data = await getCartes();
    if (data.length === 0) {
      Alert.alert("Info", "Aucune carte trouvée.");
    }
    setCartes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCartes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💳 Mes Cartes Bancaires</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : (
        <FlatList
          data={cartes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>{item.nom}</Text>
                <View style={styles.chipIcon} />
              </View>
              <Text style={styles.cardNumber}>{formatCardNumber(item.numero)}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardLabel}>VALID THRU</Text>
                <Text style={styles.cardDate}>12/25</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

// ✅ Fonction pour formater le numéro de carte bancaire
const formatCardNumber = (number: string) => {
  return number.replace(/(\d{4})/g, '$1 ').trim();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#6366F1",
    fontSize: 16,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#6366F1",
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardType: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
  },
  chipIcon: {
    width: 40,
    height: 30,
    backgroundColor: "#FFD700",
    borderRadius: 6,
  },
  cardNumber: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: 2,
    marginTop: 20,
  },
  cardFooter: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginTop: 20,
  },
  cardLabel: {
    color: "#E5E7EB",
    fontSize: 12,
    fontWeight: "500",
  },
  cardDate: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CardItem;
