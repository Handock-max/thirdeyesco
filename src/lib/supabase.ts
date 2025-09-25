import { createClient } from '@supabase/supabase-js';

// Configuration Supabase pour Third Eyes Co.
// Ces variables d'environnement doivent être définies dans le fichier .env

// URL de votre projet Supabase (à remplacer par votre vraie URL)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mfgxddzvsjnoehonwyci.supabase.co';

// Clé anonyme de votre projet Supabase (à remplacer par votre vraie clé)
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZ3hkZHp2c2pub2Vob253eWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzU4MDQsImV4cCI6MjA3MzYxMTgwNH0.o0G2oDm8wqHHpJRkF-5TUPWH0D6gj-zyuPPb3FSG7l8';

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types TypeScript pour la base de données
export interface InscriptionFormation {
  id?: string;
  nom_complet: string;
  email: string;
  telephone: string;
  ville: string;
  type_formation: 'individuelle' | 'pack' | 'cycle';
  formation_specifique: string;
  prix: number;
  mode_formation: 'presentiel' | 'enligne' | 'mixte';
  motivation: string;
  centres_interet: string[];
  accepte_conditions: boolean;
  created_at?: string;
  updated_at?: string;
}

// Fonctions utilitaires pour les inscriptions
export const inscriptionService = {
  // Sauvegarder une nouvelle inscription
  async saveInscription(data: Omit<InscriptionFormation, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data: result, error } = await supabase
        .from('inscriptions')
        .insert([data])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'inscription:', error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer toutes les inscriptions (pour l'administration)
  async getAllInscriptions() {
    try {
      const { data, error } = await supabase
        .from('inscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erreur lors de la récupération des inscriptions:', error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer une inscription par ID
  async getInscriptionById(id: string) {
    try {
      const { data, error } = await supabase
        .from('inscriptions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'inscription:', error);
      return { success: false, error: error.message };
    }
  },

  // Mettre à jour le statut d'une inscription
  async updateInscriptionStatus(id: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('inscriptions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'inscription:', error);
      return { success: false, error: error.message };
    }
  }
};

// Fonction pour tester la connexion Supabase
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('inscriptions')
      .select('count')
      .limit(1);

    if (error) {
      throw error;
    }

    return { success: true, message: 'Connexion Supabase réussie' };
  } catch (error) {
    console.error('Erreur de connexion Supabase:', error);
    return { success: false, error: error.message };
  }
};
