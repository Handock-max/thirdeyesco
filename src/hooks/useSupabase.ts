import { useState, useEffect } from 'react';
import { supabase, inscriptionService, testSupabaseConnection } from '@/lib/supabase';
import type { InscriptionFormation } from '@/lib/supabase';

// Hook personnalisé pour gérer les inscriptions avec Supabase
export const useSupabase = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test de connexion au montage du composant
  useEffect(() => {
    const testConnection = async () => {
      setIsLoading(true);
      const result = await testSupabaseConnection();
      setIsConnected(result.success);
      setError(result.success ? null : result.error);
      setIsLoading(false);
    };

    testConnection();
  }, []);

  // Fonction pour sauvegarder une inscription
  const saveInscription = async (data: Omit<InscriptionFormation, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await inscriptionService.saveInscription(data);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour récupérer toutes les inscriptions
  const getAllInscriptions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await inscriptionService.getAllInscriptions();
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour récupérer une inscription par ID
  const getInscriptionById = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await inscriptionService.getInscriptionById(id);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour mettre à jour le statut d'une inscription
  const updateInscriptionStatus = async (id: string, status: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await inscriptionService.updateInscriptionStatus(id, status);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // État de la connexion
    isConnected,
    isLoading,
    error,
    
    // Fonctions
    saveInscription,
    getAllInscriptions,
    getInscriptionById,
    updateInscriptionStatus,
    
    // Client Supabase direct (pour usage avancé)
    supabase
  };
};
