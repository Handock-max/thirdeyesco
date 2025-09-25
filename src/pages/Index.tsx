import React, { useState } from 'react';
import WelcomePage from '@/components/WelcomePage';
import FormationInscription from '@/components/FormationInscription';

/**
 * Page d'accueil principale du site Third Eyes Co.
 * Gère la navigation entre la page d'accueil et le formulaire d'inscription
 */
const Index = () => {
  // État pour contrôler l'affichage du formulaire d'inscription
  const [showInscription, setShowInscription] = useState(false);

  /**
   * Fonction appelée quand l'utilisateur clique sur "Je m'inscris"
   * Affiche le formulaire d'inscription
   */
  const handleStartInscription = () => {
    setShowInscription(true);
  };

  return (
    <>
      {!showInscription ? (
        // Affichage de la page d'accueil avec le bouton d'inscription
        <WelcomePage onStartInscription={handleStartInscription} />
      ) : (
        // Affichage du formulaire d'inscription multi-étapes
        <FormationInscription />
      )}
    </>
  );
};

export default Index;
