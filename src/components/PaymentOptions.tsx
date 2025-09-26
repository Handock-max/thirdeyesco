// Composant de gestion des paiements mobiles
// Ce composant gère les options de paiement (total/frais) et les opérateurs (Flooz/Mixx)

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    CreditCard,
    Smartphone,
    AlertTriangle,
    CheckCircle,
    Copy,
    Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    PAYMENT_CONFIG,
    PaymentUtils,
    OPERATEURS,
    type OptionPaiement
} from '@/config/payment';
import { notifierPaiement } from '@/lib/slack';

// Import des logos des opérateurs
import floozLogo from '@/assets/images/flooz.png';
import mixxLogo from '@/assets/images/mixx.png';

/**
 * INTERFACE POUR LES PROPS DU COMPOSANT
 * Définit ce que le composant parent doit fournir
 */
interface PaymentOptionsProps {
    // Données de l'inscription (pour les notifications)
    inscriptionData: {
        nom_complet: string;
        email: string;
        telephone: string;
        ville: string;
        formation_specifique: string;
        prix: number;
        type_formation: string;
        mode_formation: string;
    };

    // Prix total de la formation
    prixTotal: number;

    // Fonction appelée après le paiement
    onPaymentInitiated: () => void;
}

/**
 * COMPOSANT PRINCIPAL DES OPTIONS DE PAIEMENT
 */
const PaymentOptions: React.FC<PaymentOptionsProps> = ({
    inscriptionData,
    prixTotal,
    onPaymentInitiated
}) => {
    // États du composant
    const [optionSelectionnee, setOptionSelectionnee] = useState<'total' | 'frais' | null>(null);
    const [paiementEnCours, setPaiementEnCours] = useState(false);
    const [paiementEffectue, setPaiementEffectue] = useState(false);

    const { toast } = useToast();

    // Détection si l'utilisateur est sur mobile
    const estMobile = PaymentUtils.estSurMobile();

    // Debug: Afficher la configuration des numéros (une seule fois)
    React.useEffect(() => {
        PaymentUtils.debugNumerosConfig();
    }, []);

    // Calcul des montants
    const fraisInscription = PaymentUtils.calculerFraisInscription(prixTotal);

    // Options de paiement disponibles
    const optionsPaiement: OptionPaiement[] = [
        {
            type: 'total',
            montant: prixTotal,
            description: 'Payez le montant complet maintenant'
        },
        {
            type: 'frais',
            montant: fraisInscription,
            description: 'Payez seulement les frais d\'inscription pour réserver'
        }
    ];

    /**
     * GESTION DE LA SÉLECTION D'UNE OPTION DE PAIEMENT
     * @param option - L'option sélectionnée ('total' ou 'frais')
     */
    const handleOptionSelection = (option: 'total' | 'frais') => {
        setOptionSelectionnee(option);
        console.log(`💳 Option sélectionnée: ${option}`);
    };

    /**
     * GESTION DU PAIEMENT VIA UN OPÉRATEUR
     * @param operateur - L'opérateur choisi ('flooz' ou 'mixx')
     */
    const handlePaiement = async (operateur: 'flooz' | 'mixx') => {
        if (!optionSelectionnee) return;

        setPaiementEnCours(true);

        // Récupération du montant selon l'option
        const montant = optionSelectionnee === 'total' ? prixTotal : fraisInscription;

        console.log(`💰 Paiement ${operateur.toUpperCase()}: ${montant} FCFA`);

        try {
            // Notification Slack de la tentative de paiement
            console.log('📤 Tentative notification Slack paiement...');
            const slackResult = await notifierPaiement(inscriptionData, optionSelectionnee, montant, operateur);
            console.log('📱 Résultat notification Slack paiement:', slackResult);

            if (estMobile) {
                // Sur mobile: générer et afficher le code USSD
                let codeUSSD: string;

                if (operateur === 'flooz') {
                    // Pour Flooz, on utilise le numéro de l'utilisateur comme expéditeur
                    codeUSSD = PaymentUtils.genererUSSDFlooz(montant, inscriptionData.telephone);
                } else {
                    // Pour Mixx
                    codeUSSD = PaymentUtils.genererUSSDMixx(montant);
                }

                console.log(`📱 Code USSD généré: ${codeUSSD}`);

                // Copier le code et ouvrir l'app téléphone
                const copieCopie = await PaymentUtils.copierCodeUSSD(codeUSSD);
                
                // Afficher les instructions avant d'ouvrir l'app téléphone
                toast({
                    title: `Code ${operateur.toUpperCase()} généré !`,
                    description: `📋 Code: ${codeUSSD}\n\n📱 Instructions:\n1. Composez ce code sur votre téléphone\n2. Suivez les instructions\n3. Confirmez le paiement`,
                    duration: 10000, // 10 secondes pour lire
                });

                // Attendre un peu puis ouvrir l'app téléphone
                setTimeout(() => {
                    PaymentUtils.declencherUSSD(codeUSSD);
                }, 3000); // 3 secondes de délai

            } else {
                // Sur desktop: afficher les informations de paiement
                const numeroOperateur = operateur === 'flooz'
                    ? PAYMENT_CONFIG.FLOOZ_NUMBER
                    : PAYMENT_CONFIG.MIXX_NUMBER;

                toast({
                    title: `Paiement ${operateur.toUpperCase()}`,
                    description: `Envoyez ${montant.toLocaleString()} FCFA au ${numeroOperateur}`,
                });
            }

            // Marquer le paiement comme effectué
            setPaiementEffectue(true);

            // Notifier le composant parent
            onPaymentInitiated();

        } catch (error) {
            console.error('❌ Erreur lors du paiement:', error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue. Veuillez réessayer.",
                variant: "destructive"
            });
        } finally {
            setPaiementEnCours(false);
        }
    };

    /**
     * COPIER UN NUMÉRO DANS LE PRESSE-PAPIER (pour desktop)
     */
    const copierNumero = async (numero: string, operateur: string) => {
        try {
            await navigator.clipboard.writeText(numero);
            toast({
                title: "Numéro copié !",
                description: `Le numéro ${operateur} a été copié dans le presse-papier.`,
            });
        } catch (error) {
            console.error('Erreur copie:', error);
        }
    };

    // Si le paiement a été effectué, afficher le message de confirmation
    if (paiementEffectue) {
        return (
            <Card className="glass-card fade-in">
                <CardContent className="p-8 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-4">
                        {PAYMENT_CONFIG.MESSAGES.APRES_PAIEMENT.TITRE}
                    </h3>

                    <p className="text-muted-foreground mb-6">
                        {PAYMENT_CONFIG.MESSAGES.APRES_PAIEMENT.DESCRIPTION}
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                        <p className="text-sm font-medium">
                            {PAYMENT_CONFIG.MESSAGES.APRES_PAIEMENT.CONTACT}
                        </p>
                    </div>

                    {/* Bouton pour revenir à l'accueil après paiement */}
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="w-full"
                    >
                        Revenir à l'Accueil
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Titre et description */}
            <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">
                    {PAYMENT_CONFIG.MESSAGES.TITRE_PAIEMENT}
                </h3>
                <p className="text-muted-foreground">
                    {PAYMENT_CONFIG.MESSAGES.DESCRIPTION_PAIEMENT}
                </p>
            </div>

            {/* Options de paiement */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Choisissez votre option de paiement
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {optionsPaiement.map((option) => (
                        <div
                            key={option.type}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${optionSelectionnee === option.type
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                                }`}
                            onClick={() => handleOptionSelection(option.type)}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold">
                                        {option.type === 'total'
                                            ? PAYMENT_CONFIG.MESSAGES.OPTION_TOTALE
                                            : PAYMENT_CONFIG.MESSAGES.OPTION_FRAIS
                                        }
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {option.description}
                                    </p>
                                </div>
                                <Badge variant="secondary" className="text-lg font-bold">
                                    {option.montant.toLocaleString()} FCFA
                                </Badge>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                <CardContent className="p-4">
                    <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div className="space-y-2 text-sm">
                            <p>{PAYMENT_CONFIG.MESSAGES.DISCLAIMER.FRAIS}</p>
                            <p>{PAYMENT_CONFIG.MESSAGES.DISCLAIMER.FORMATION}</p>
                            <p>{PAYMENT_CONFIG.MESSAGES.DISCLAIMER.PREUVE}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sélection de l'opérateur */}
            {optionSelectionnee && (
                <Card className="glass-card fade-in">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Smartphone className="w-5 h-5 mr-2" />
                            {estMobile
                                ? PAYMENT_CONFIG.MESSAGES.INSTRUCTIONS_MOBILE
                                : PAYMENT_CONFIG.MESSAGES.INSTRUCTIONS_DESKTOP
                            }
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {OPERATEURS.map((operateur) => (
                                <div key={operateur.nom} className="space-y-2">
                                    {estMobile ? (
                                        // Sur mobile: bouton pour déclencher l'USSD
                                        <Button
                                            onClick={() => handlePaiement(operateur.nom)}
                                            disabled={paiementEnCours}
                                            className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                            style={{ backgroundColor: operateur.couleur }}
                                        >
                                            <img
                                                src={operateur.nom === 'flooz' ? floozLogo : mixxLogo}
                                                alt={`Logo ${operateur.nom}`}
                                                className="h-8 w-auto"
                                            />
                                            <span className="text-white font-semibold">
                                                Payer avec {operateur.nom.toUpperCase()}
                                            </span>
                                        </Button>
                                    ) : (
                                        // Sur desktop: affichage du numéro avec bouton copier
                                        <Card className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={operateur.nom === 'flooz' ? floozLogo : mixxLogo}
                                                        alt={`Logo ${operateur.nom}`}
                                                        className="h-8 w-auto"
                                                    />
                                                    <div>
                                                        <p className="font-semibold">{operateur.nom.toUpperCase()}</p>
                                                        <p className="text-lg font-mono">{operateur.numero}</p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => copierNumero(operateur.numero, operateur.nom)}
                                                    >
                                                        <Copy className="w-4 h-4 mr-1" />
                                                        Copier
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handlePaiement(operateur.nom)}
                                                        disabled={paiementEnCours}
                                                    >
                                                        <Phone className="w-4 h-4 mr-1" />
                                                        Confirmer
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default PaymentOptions;