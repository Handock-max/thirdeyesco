import React, { useState } from 'react';
import WelcomePage from '@/components/WelcomePage';
import FormationInscription from '@/components/FormationInscription';

const Index = () => {
  const [showInscription, setShowInscription] = useState(false);

  const handleStartInscription = () => {
    setShowInscription(true);
  };

  return (
    <>
      {!showInscription ? (
        <WelcomePage onStartInscription={handleStartInscription} />
      ) : (
        <FormationInscription />
      )}
    </>
  );
};

export default Index;
