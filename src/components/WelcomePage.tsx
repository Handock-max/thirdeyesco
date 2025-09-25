import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Sparkles, Users, BarChart, Eye, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import thirdEyesLogo from '@/assets/third-eyes-logo.png';

/**
 * Props pour le composant WelcomePage
 */
interface WelcomePageProps {
  /** Fonction appelée quand l'utilisateur clique sur le bouton d'inscription */
  onStartInscription: () => void;
}

/**
 * Composant de la page d'accueil Third Eyes Co.
 * Affiche les informations sur les formations et permet de commencer l'inscription
 */
const WelcomePage: React.FC<WelcomePageProps> = ({ onStartInscription }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Logo en arrière-plan flouté pour l'effet visuel */}
      <div 
        className="logo-backdrop"
        style={{ backgroundImage: `url(${thirdEyesLogo})` }}
      />
      
      {/* Bouton de basculement de thème en haut à droite */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Contenu principal de la page d'accueil */}
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          {/* Logo principal */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src={thirdEyesLogo} 
                alt="Third Eyes Co. Logo"
                className="w-32 h-32 object-contain drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-full blur-xl"></div>
            </div>
          </div>
          
          {/* Titre principal */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Third Eyes Co.
          </h1>
          
          {/* Sous-titre */}
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Formations Data Science & Intelligence Artificielle
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Développez vos compétences en Data Science et IA avec nos formations professionnelles. 
              Des programmes conçus pour vous donner une longueur d'avance dans l'économie numérique.
            </p>
          </div>
          
          {/* Statistiques/Features rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="glass-card border-card-border/50">
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">4</div>
                <div className="text-sm text-muted-foreground">Modules experts</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-card-border/50">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">8</div>
                <div className="text-sm text-muted-foreground">Jours intensifs</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-card-border/50">
              <CardContent className="p-4 text-center">
                <BarChart className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">Pratique</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-card-border/50">
              <CardContent className="p-4 text-center">
                <Eye className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">∞</div>
                <div className="text-sm text-muted-foreground">Perspectives</div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Call to action principal */}
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              Prêt à transformer votre carrière ?
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Rejoignez notre programme de formation et maîtrisez les outils de demain.
            </p>
          </div>
          
          {/* Bouton principal clignotant */}
          <Button
            onClick={onStartInscription}
            size="lg"
            className="btn-primary-glow pulse-glow text-lg px-8 py-6 text-white font-semibold"
          >
            <Sparkles className="w-6 h-6 mr-3" />
            Je m'inscris
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
          
          <p className="text-sm text-muted-foreground">
            🎯 Places limitées • ⚡ Inscription rapide • 📞 Support personnel
          </p>
        </div>
        
        {/* Informations supplémentaires */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card className="glass-card border-card-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Formations flexibles</h4>
              <p className="text-sm text-muted-foreground">
                Modules individuels, packs combinés ou cycle complet selon vos besoins
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-card-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Présentiel & En ligne</h4>
              <p className="text-sm text-muted-foreground">
                Choisissez le mode qui vous convient le mieux pour apprendre efficacement
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-card-border/30 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Suivi personnalisé</h4>
              <p className="text-sm text-muted-foreground">
                Accompagnement individuel et support continu tout au long de votre parcours
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;