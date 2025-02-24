const API_URL = "http://172.20.10.5:5000"; // Remplace par ton IP locale

// ✅ GET - Récupérer toutes les cartes
export const getCartes = async () => {
  try {
    const response = await fetch(`${API_URL}/carte`);
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des cartes :", error);
    return [];
  }
};

// ✅ POST - Ajouter une carte
export const addCarte = async (nom, numero) => {
  try {
    const response = await fetch(`${API_URL}/carte`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, numero }),
    });

    if (!response.ok) throw new Error("Erreur lors de l'ajout de la carte");

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
    return null;
  }
};

// ✅ DELETE - Supprimer une carte
export const deleteCarte = async (id) => {
  try {
    const response = await fetch(`${API_URL}/carte/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erreur lors de la suppression de la carte");

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    return null;
  }
};

// ✅ PUT - Modifier une carte
export const updateCarte = async (id, nom, numero) => {
  try {
    const response = await fetch(`${API_URL}/carte/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, numero }),
    });

    if (!response.ok) throw new Error("Erreur lors de la mise à jour de la carte");

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return null;
  }
};
