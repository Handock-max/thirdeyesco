import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Eye, Users, Brain, BarChart, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/hooks/useSupabase';
import ThemeToggle from '@/components/ThemeToggle';
import { getWhatsAppUrl } from '@/config/site';
import { PaymentUtils } from '@/config/payment';
import { notifierInscription } from '@/lib/slack';
import PaymentOptions from '@/components/PaymentOptions';
import thirdEyesLogo from '@/assets/third-eyes-logo.png';

// Types pour le formulaire - COMPLETER selon les besoins spécifiques
interface FormData {
  // Page 1 : Informations personnelles
  nomComplet: string;
  email: string;
  telephone: string;
  ville: string;

  // Page 2 : Sélection formation
  typeFormation: 'individuelle' | 'pack' | 'cycle' | '';
  formationSpecifique: string;
  prix: number;

  // Page 3 : Modalités
  modeFormation: 'presentiel' | 'enligne' | 'mixte' | '';
  motivation: string;
  centresInteret: string[];

  // Page 4 : Consentement
  accepteConditions: boolean;
}

// Configuration des formations - MODIFIER selon vos tarifs exacts
const FORMATIONS_CONFIG = {
  individuelle: [
    { id: 'data-debutant', nom: 'Data Analyse Débutant (2 jours)', prix: 25000 },
    { id: 'data-intermediaire', nom: 'Data Analyse Intermédiaire (2 jours)', prix: 35000 },
    { id: 'ia-debutant', nom: 'IA Débutant (2 jours)', prix: 25000 },
    { id: 'ia-intermediaire', nom: 'IA Intermédiaire (2 jours)', prix: 35000 }
  ],
  pack: [
    { id: 'pack-debutant', nom: 'Pack Débutant (Data Analyse + IA, 4 jours)', prix: 45000 },
    { id: 'pack-intermediaire', nom: 'Pack Intermédiaire (Data Analyse + IA, 4 jours)', prix: 65000 }
  ],
  cycle: [
    { id: 'cycle-complet', nom: 'Cycle complet (8 jours)', prix: 100000 }
  ]
};

const CENTRES_INTERET = [
  'Analyse de données',
  'Data Visualization',
  'Business Intelligence',
  'Intelligence Artificielle',
  'Storytelling & Communication avec les données'
];

const FormationInscription: React.FC = () => {
  // États pour la navigation dans le formulaire
  const [currentStep, setCurrentStep] = useState(0);

  // États pour les données du formulaire
  const [formData, setFormData] = useState<FormData>({
    nomComplet: '',
    email: '',
    telephone: '',
    ville: '',
    typeFormation: '',
    formationSpecifique: '',
    prix: 0,
    modeFormation: '',
    motivation: '',
    centresInteret: [],
    accepteConditions: false
  });

  // États pour le processus d'inscription et paiement
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPayment, setShowPayment] = useState(false); // NOUVEAU: pour afficher les options de paiement
  const [paymentInitiated, setPaymentInitiated] = useState(false); // NOUVEAU: pour tracker si le paiement a été initié
  const [showContactOptions, setShowContactOptions] = useState(false); // NOUVEAU: étape contact (mobile)

  const { toast } = useToast();

  // Hook Supabase pour la sauvegarde des données
  const { saveInscription, isLoading: isSupabaseLoading, error: supabaseError } = useSupabase();

  // Fonction pour calculer le prix automatiquement - LOGIQUE METIER IMPORTANTE
  const calculerPrix = (type: string, formation: string) => {
    const configs = FORMATIONS_CONFIG[type as keyof typeof FORMATIONS_CONFIG] || [];
    const formationTrouvee = configs.find(f => f.id === formation);
    return formationTrouvee?.prix || 0;
  };

  // Gérer les changements de données du formulaire
  const handleInputChange = (field: keyof FormData, value: string | number | boolean | string[]) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Recalculer le prix si le type ou la formation change
      if (field === 'typeFormation' || field === 'formationSpecifique') {
        newData.prix = calculerPrix(
          field === 'typeFormation' ? value : newData.typeFormation,
          field === 'formationSpecifique' ? value : newData.formationSpecifique
        );
      }

      return newData;
    });
  };

  // Navigation entre les étapes
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Validation des étapes - AJOUTER plus de validations si nécessaire
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(formData.nomComplet && formData.email && formData.telephone && formData.ville);
      case 1:
        return !!(formData.typeFormation && formData.formationSpecifique);
      case 2:
        return !!(formData.modeFormation && formData.motivation);
      case 3:
        return formData.accepteConditions;
      default:
        return true;
    }
  };

  // Soumission du formulaire - CONNECTE A SUPABASE ET SLACK
  const handleSubmit = async () => {
    try {
      // Préparation des données pour Supabase
      const inscriptionData = {
        nom_complet: formData.nomComplet,
        email: formData.email,
        telephone: formData.telephone,
        ville: formData.ville,
        type_formation: formData.typeFormation as 'individuelle' | 'pack' | 'cycle',
        formation_specifique: formData.formationSpecifique,
        prix: formData.prix,
        mode_formation: formData.modeFormation as 'presentiel' | 'enligne' | 'mixte',
        motivation: formData.motivation,
        centres_interet: formData.centresInteret,
        accepte_conditions: formData.accepteConditions
      };

      console.log('📝 Tentative de sauvegarde:', inscriptionData);

      // Sauvegarde dans Supabase
      const result = await saveInscription(inscriptionData);

      console.log('💾 Résultat de la sauvegarde:', result);

      if (result.success) {
        // ✅ SUCCÈS: Inscription sauvegardée
        console.log('✅ Inscription sauvegardée avec succès');

        // Notification Slack de la nouvelle inscription
        try {
          console.log('📤 Tentative notification Slack inscription...');
          const slackResult = await notifierInscription(inscriptionData);
          console.log('📱 Résultat notification Slack:', slackResult);
        } catch (slackError) {
          console.warn('⚠️ Erreur notification Slack:', slackError);
          // On continue même si Slack échoue
        }

        // Vérifier si on doit afficher les options de paiement (mobile uniquement)
        const estMobile = PaymentUtils.estSurMobile();

        if (estMobile) {
          // Sur mobile: afficher les options de paiement
          setShowPayment(true);
          toast({
            title: "Inscription réussie !",
            description: "Vous pouvez maintenant réserver votre place en payant.",
          });
        } else {
          // Sur desktop: inscription terminée directement
          setIsSubmitted(true);
          toast({
            title: "Inscription réussie !",
            description: `Merci ${formData.nomComplet}, nous vous recontacterons sous 24h.`
          });
        }

      } else {
        // ❌ ERREUR: Problème avec Supabase
        const errorMessage = result.error || 'Erreur inconnue lors de la sauvegarde';
        console.error('❌ Erreur Supabase:', errorMessage);

        // Sauvegarde de fallback dans localStorage
        try {
          const fallbackData = {
            ...inscriptionData,
            timestamp: new Date().toISOString(),
            id: `fallback_${Date.now()}`
          };

          const existingData = JSON.parse(localStorage.getItem('inscriptions_fallback') || '[]');
          existingData.push(fallbackData);
          localStorage.setItem('inscriptions_fallback', JSON.stringify(existingData));

          console.log('💾 Données sauvegardées en local comme fallback');

          toast({
            title: "Inscription enregistrée localement",
            description: `Votre inscription a été sauvegardée. Nous vous recontacterons via WhatsApp.`,
            variant: "default"
          });

          setIsSubmitted(true);
        } catch (fallbackError) {
          toast({
            title: "Erreur de sauvegarde",
            description: `Erreur: ${errorMessage}. Contactez-nous directement sur WhatsApp.`,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);

      // Message d'erreur plus détaillé
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';

      toast({
        title: "Erreur technique",
        description: `Problème technique: ${errorMessage}. Contactez-nous si le problème persiste.`,
        variant: "destructive"
      });
    }
  };

  /**
   * NOUVELLE FONCTION: Gestion après initiation du paiement
   * Appelée quand l'utilisateur a initié un paiement
   */
  const handlePaymentInitiated = () => {
    console.log('💳 Paiement initié par l\'utilisateur');
    setPaymentInitiated(true);
    setIsSubmitted(true); // Afficher le message final
  };

  /**
   * FONCTION: Retour à l'accueil
   * Remet à zéro le formulaire et retourne à la page d'accueil
   */
  const retourAccueil = () => {
    // Recharger la page pour revenir à l'état initial
    window.location.reload();
  };

  // Récupérer le libellé de la formation par son id
  const getFormationLabel = (type: string, id: string): string => {
    const configs = FORMATIONS_CONFIG[type as keyof typeof FORMATIONS_CONFIG] || [];
    return configs.find(f => f.id === id)?.nom || id;
  };

  // Construire le message WhatsApp récapitulatif
  const buildWhatsAppRecapMessage = (): string => {
    const formationNom = getFormationLabel(formData.typeFormation, formData.formationSpecifique);
    const montant = formData.prix > 0 ? `${formData.prix.toLocaleString()} FCFA` : '—';
    return `Bonjour Third Eyes Co. 👋\n\n` +
      `Je viens de finaliser mon inscription. Voici mon récapitulatif :\n\n` +
      `👤 Nom : ${formData.nomComplet}\n` +
      `📚 Formation : ${formationNom}\n` +
      `💰 Montant : ${montant}\n\n` +
      `Merci de me confirmer la suite. 🙏`;
  };

  // Fonction pour contacter WhatsApp (générique)
  const contactWhatsApp = () => {
    const message = buildWhatsAppRecapMessage();
    const url = getWhatsAppUrl(message);
    window.open(url, '_blank');
  };

  // Aller à l'étape Contact (mobile) après avoir choisi de passer le paiement
  const allerEtapeContact = () => {
    setShowContactOptions(true);
  };

  // Vue: Étape Contact (mobile) avec 2 boutons
  if (showContactOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Logo en arrière-plan flouté */}
        <div
          className="logo-backdrop"
          style={{ backgroundImage: `url(${thirdEyesLogo})` }}
        />

        {/* Boutons en haut à droite */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={retourAccueil}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Quitter
          </Button>
          <ThemeToggle />
        </div>

        <Card className="glass-card w-full max-w-lg fade-in">
          <CardContent className="p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Besoin d'aide immédiate ?
            </h2>

            <p className="text-muted-foreground mb-6">
              Vous pouvez nous écrire sur WhatsApp maintenant ou revenir à l'accueil.
            </p>

            <div className="space-y-3">
              <Button
                onClick={contactWhatsApp}
                className="btn-primary-glow w-full"
                size="lg"
              >
                <Users className="w-5 h-5 mr-2" />
                Nous contacter sur WhatsApp
              </Button>

              <Button
                variant="outline"
                onClick={retourAccueil}
                className="w-full"
              >
                Quitter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rendu des options de paiement (mobile uniquement)
  if (showPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Logo en arrière-plan flouté */}
        <div
          className="logo-backdrop"
          style={{ backgroundImage: `url(${thirdEyesLogo})` }}
        />

        {/* Boutons en haut à droite */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={retourAccueil}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Quitter
          </Button>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-2xl">
          {/* Composant des options de paiement */}
          <PaymentOptions
            inscriptionData={{
              nom_complet: formData.nomComplet,
              email: formData.email,
              telephone: formData.telephone,
              ville: formData.ville,
              formation_specifique: formData.formationSpecifique,
              prix: formData.prix,
              type_formation: formData.typeFormation,
              mode_formation: formData.modeFormation
            }}
            prixTotal={formData.prix}
            onPaymentInitiated={handlePaymentInitiated}
          />

          {/* Bouton pour passer le paiement et accéder à l'étape Contact (mobile) */}
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={allerEtapeContact}
              className="w-full"
            >
              Passer le paiement pour l'instant
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Rendu du message de succès final
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Logo en arrière-plan flouté */}
        <div
          className="logo-backdrop"
          style={{ backgroundImage: `url(${thirdEyesLogo})` }}
        />

        {/* Boutons en haut à droite */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={retourAccueil}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Quitter
          </Button>
          <ThemeToggle />
        </div>

        <Card className="glass-card w-full max-w-lg success-message fade-in">
          <CardContent className="p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-foreground">
              {paymentInitiated ? "Paiement initié !" : "Inscription réussie !"}
            </h2>

            <p className="text-muted-foreground mb-6">
              Merci <strong>{formData.nomComplet}</strong>, votre inscription à{' '}
              <strong>{formData.formationSpecifique}</strong> est bien enregistrée.
              {paymentInitiated
                ? " Nous traiterons votre paiement et vous recontacterons sous 24h."
                : " Vous recevrez un email de confirmation sous 24h."
              }
            </p>

            <div className="space-y-3">
              {paymentInitiated ? (
                // Si paiement initié, bouton pour envoyer la preuve
                <Button
                  onClick={() => {
                    const message = `Bonjour Third Eyes Co. 👋

🎓 *PREUVE DE PAIEMENT*

👤 Nom: ${formData.nomComplet}
📚 Formation: ${formData.formationSpecifique}
💰 Montant payé: ${formData.prix.toLocaleString()} FCFA

✅ J'ai effectué le paiement, je vous envoie la preuve de paiement ci-joint.

Merci de confirmer la réception.`;

                    const numeroWhatsApp = (import.meta.env.VITE_WHATSAPP_NUMBER || "+22893858934").replace(/[^0-9]/g, "");
                    const whatsappUrl = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="btn-primary-glow w-full"
                  size="lg"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Envoyer la preuve de paiement
                </Button>
              ) : (
                // Sinon, bouton contact normal
                <Button
                  onClick={contactWhatsApp}
                  className="btn-primary-glow w-full"
                  size="lg"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Nous contacter sur WhatsApp
                </Button>
              )}

              <Button
                variant="outline"
                onClick={retourAccueil}
                className="w-full"
              >
                {paymentInitiated ? "Revenir à l'Accueil" : "Nouvelle inscription"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rendu des étapes du formulaire
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        // PAGE 1 : INFORMATIONS PERSONNELLES
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Vos informations</h2>
              <p className="text-muted-foreground">
                Commençons par créer votre profil Third Eyes Co.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nomComplet">Nom complet *</Label>
                <Input
                  id="nomComplet"
                  className="modern-input"
                  value={formData.nomComplet}
                  onChange={(e) => handleInputChange('nomComplet', e.target.value)}
                  placeholder="Votre nom et prénom"
                />
              </div>

              <div>
                <Label htmlFor="email">Adresse e-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  className="modern-input"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <Label htmlFor="telephone">Téléphone / WhatsApp *</Label>
                <Input
                  id="telephone"
                  className="modern-input"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="+228 00 00 00 00"
                />
              </div>

              <div>
                <Label htmlFor="ville">Ville / Localité *</Label>
                <Input
                  id="ville"
                  className="modern-input"
                  value={formData.ville}
                  onChange={(e) => handleInputChange('ville', e.target.value)}
                  placeholder="Votre ville"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        // PAGE 2 : SELECTION DE LA FORMATION
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Votre formation</h2>
              <p className="text-muted-foreground">
                Choisissez la formation qui vous correspond
              </p>
            </div>

            {/* Sélection du type de formation */}
            <div>
              <Label className="text-base font-semibold mb-4 block">
                Type de formation *
              </Label>
              <RadioGroup
                value={formData.typeFormation}
                onValueChange={(value) => handleInputChange('typeFormation', value)}
                className="space-y-3"
              >
                <div className="custom-radio">
                  <RadioGroupItem value="individuelle" id="individuelle" />
                  <Label htmlFor="individuelle" className="radio-content block ml-6 cursor-pointer">
                    <div className="font-medium">Formations individuelles</div>
                    <div className="text-sm text-muted-foreground">
                      Choisissez une formation spécifique (2 jours)
                    </div>
                  </Label>
                </div>

                <div className="custom-radio">
                  <RadioGroupItem value="pack" id="pack" />
                  <Label htmlFor="pack" className="radio-content block ml-6 cursor-pointer">
                    <div className="font-medium">Packs combinés</div>
                    <div className="text-sm text-muted-foreground">
                      Data + IA ensemble (4 jours, économie garantie)
                    </div>
                  </Label>
                </div>

                <div className="custom-radio">
                  <RadioGroupItem value="cycle" id="cycle" />
                  <Label htmlFor="cycle" className="radio-content block ml-6 cursor-pointer">
                    <div className="font-medium">Cycle complet</div>
                    <div className="text-sm text-muted-foreground">
                      Formation complète 4 modules (8 jours)
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Sélection de la formation spécifique */}
            {formData.typeFormation && (
              <div className="fade-in">
                <Label className="text-base font-semibold mb-4 block">
                  Formation spécifique *
                </Label>
                <Select
                  value={formData.formationSpecifique}
                  onValueChange={(value) => handleInputChange('formationSpecifique', value)}
                >
                  <SelectTrigger className="modern-input">
                    <SelectValue placeholder="Choisissez votre formation" />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMATIONS_CONFIG[formData.typeFormation as keyof typeof FORMATIONS_CONFIG]?.map((formation) => (
                      <SelectItem key={formation.id} value={formation.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{formation.nom}</span>
                          <span className="font-bold text-white bg-primary px-2 py-1 rounded ml-4">
                            {formation.prix.toLocaleString()} FCFA
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Affichage du prix */}
            {formData.prix > 0 && (
              <div className="glass-card p-4 text-center fade-in">
                <div className="text-sm text-muted-foreground">Prix de la formation</div>
                <div className="text-3xl font-bold text-primary">
                  {formData.prix.toLocaleString()} FCFA
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        // PAGE 3 : MODALITES DE PARTICIPATION
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Modalités</h2>
              <p className="text-muted-foreground">
                Comment souhaitez-vous suivre la formation ?
              </p>
            </div>

            {/* Mode de formation */}
            <div>
              <Label className="text-base font-semibold mb-4 block">
                Mode de formation préféré *
              </Label>
              <RadioGroup
                value={formData.modeFormation}
                onValueChange={(value) => handleInputChange('modeFormation', value)}
                className="space-y-3"
              >
                <div className="custom-radio">
                  <RadioGroupItem value="presentiel" id="presentiel" />
                  <Label htmlFor="presentiel" className="radio-content block ml-6 cursor-pointer">
                    <div className="font-medium flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      En présentiel
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Formation en classe, interaction directe
                    </div>
                  </Label>
                </div>

                <div className="custom-radio">
                  <RadioGroupItem value="enligne" id="enligne" />
                  <Label htmlFor="enligne" className="radio-content block ml-6 cursor-pointer">
                    <div className="font-medium flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      En ligne
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Formation à distance, flexible
                    </div>
                  </Label>
                </div>

                <div className="custom-radio">
                  <RadioGroupItem value="mixte" id="mixte" />
                  <Label htmlFor="mixte" className="radio-content block ml-6 cursor-pointer">
                    <div className="font-medium">Les deux me conviennent</div>
                    <div className="text-sm text-muted-foreground">
                      Nous choisirons ensemble le meilleur format
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Motivation */}
            <div>
              <Label htmlFor="motivation" className="text-base font-semibold">
                Motivation / Objectif *
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Pourquoi souhaitez-vous suivre cette formation ? Quels sont vos objectifs ?
              </p>
              <Textarea
                id="motivation"
                className="modern-input min-h-24"
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                placeholder="Partagez vos motivations et objectifs avec cette formation..."
              />
            </div>

            {/* Centres d'intérêt */}
            <div>
              <Label className="text-base font-semibold mb-4 block">
                Centres d'intérêt liés à la Data / IA
              </Label>
              <div className="space-y-3">
                {CENTRES_INTERET.map((interet) => (
                  <div key={interet} className="flex items-center space-x-3">
                    <Checkbox
                      id={interet}
                      checked={formData.centresInteret.includes(interet)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleInputChange('centresInteret', [...formData.centresInteret, interet]);
                        } else {
                          handleInputChange('centresInteret', formData.centresInteret.filter(i => i !== interet));
                        }
                      }}
                    />
                    <Label htmlFor={interet} className="cursor-pointer">
                      {interet}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        // PAGE 4 : CONFIRMATION ET PAIEMENT
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Confirmation</h2>
              <p className="text-muted-foreground">
                Vérifiez vos informations avant finalisation
              </p>
            </div>

            {/* Récapitulatif */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <BarChart className="w-5 h-5 mr-2" />
                Récapitulatif de votre inscription
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Nom :</span>
                  <span className="font-medium">{formData.nomComplet}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email :</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Formation :</span>
                  <span className="font-medium">
                    {FORMATIONS_CONFIG[formData.typeFormation as keyof typeof FORMATIONS_CONFIG]
                      ?.find(f => f.id === formData.formationSpecifique)?.nom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mode :</span>
                  <span className="font-medium capitalize">{formData.modeFormation}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total à payer :</span>
                  <span className="text-primary">{formData.prix.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            {/* Conditions générales */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="conditions"
                  checked={formData.accepteConditions}
                  onCheckedChange={(checked) => handleInputChange('accepteConditions', checked)}
                />
                <Label htmlFor="conditions" className="text-sm cursor-pointer">
                  J'accepte les conditions générales et confirme que mes informations sont correctes.
                  Je consens à être recontacté par Third Eyes Co. pour le suivi de ma formation.
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Logo en arrière-plan flouté */}
      <div
        className="logo-backdrop"
        style={{ backgroundImage: `url(${thirdEyesLogo})` }}
      />

      {/* Boutons en haut à droite */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={retourAccueil}
          className="text-muted-foreground hover:text-foreground"
        >
          ← Quitter
        </Button>
        <ThemeToggle />
      </div>

      <Card className="glass-card w-full max-w-2xl fade-in">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            Inscription Formation Third Eyes Co.
          </CardTitle>

          {/* Barre de progression */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Étape {currentStep + 1} sur 4</span>
              <span>{Math.round(((currentStep + 1) / 4) * 100)}%</span>
            </div>
            <Progress
              value={((currentStep + 1) / 4) * 100}
              className="h-2"
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-card-border">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </Button>

              {/* Bouton Quitter dans la navigation */}
              <Button
                variant="ghost"
                onClick={retourAccueil}
                className="text-muted-foreground hover:text-foreground"
                size="sm"
              >
                Quitter
              </Button>
            </div>

            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="btn-primary-glow flex items-center"
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep) || isSupabaseLoading}
                className="btn-primary-glow flex items-center"
              >
                {isSupabaseLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    Finaliser l'inscription
                    <Sparkles className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormationInscription;