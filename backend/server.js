const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Connexion à PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then(() => console.log("✅ Connexion réussie à la base de données !"))
  .catch(err => {
    console.error("❌ Erreur de connexion :", err);
    process.exit(1); // Arrête le serveur si la base de données ne fonctionne pas
  });

app.use(cors());
app.use(express.json()); // ✅ Indispensable pour POST et PUT

// ✅ Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (Object.keys(req.body).length) {
    console.log("Body:", req.body);
  }
  next();
});

// ✅ GET - Récupérer toutes les cartes
app.get("/carte", async (req, res) => {
  try {
    console.log("🔍 Récupération des cartes...");
    const result = await pool.query('SELECT * FROM "public"."carte"');
    console.log("✅ Cartes récupérées:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des cartes:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ POST - Ajouter une carte
app.post("/carte", async (req, res) => {
  const { nom, numero } = req.body;

  if (!nom || !numero) {
    console.warn("⚠️ Champs manquants !");
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    console.log("➕ Ajout d'une carte...");
    const result = await pool.query(
      'INSERT INTO "public"."carte" (nom, numero) VALUES ($1, $2) RETURNING *',
      [nom, numero]
    );
    console.log("✅ Carte ajoutée:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erreur lors de l'ajout de la carte:", err);
    res.status(500).json({ error: "Erreur lors de l'ajout" });
  }
});

// ✅ PUT - Modifier une carte
app.put("/carte/:id", async (req, res) => {
  const { id } = req.params;
  const { nom, numero } = req.body;

  if (!nom || !numero) {
    console.warn("⚠️ Champs manquants !");
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    console.log(`📝 Mise à jour de la carte ID: ${id}`);
    const result = await pool.query(
      'UPDATE "public"."carte" SET nom = $1, numero = $2 WHERE id = $3 RETURNING *',
      [nom, numero, id]
    );

    if (result.rows.length === 0) {
      console.warn(`⚠️ Carte non trouvée avec ID: ${id}`);
      return res.status(404).json({ error: "Carte non trouvée" });
    }

    console.log("✅ Carte mise à jour:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erreur lors de la mise à jour de la carte:", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

// ✅ DELETE - Supprimer une carte
app.delete("/carte/:id", async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`🗑️ Suppression de la carte ID: ${id}`);
    const result = await pool.query(
      'DELETE FROM "public"."carte" WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      console.warn(`⚠️ Carte non trouvée avec ID: ${id}`);
      return res.status(404).json({ error: "Carte non trouvée" });
    }

    console.log("✅ Carte supprimée:", result.rows[0]);
    res.json({ message: "Carte supprimée avec succès" });
  } catch (err) {
    console.error("❌ Erreur lors de la suppression de la carte:", err);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

// 🚀 Démarrer le serveur sur toutes les interfaces
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Serveur accessible sur http://0.0.0.0:${port}`);
});
