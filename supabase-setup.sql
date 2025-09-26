-- Script SQL pour créer la table des inscriptions dans Supabase
-- Exécutez ce script dans l'éditeur SQL de votre dashboard Supabase

-- Créer la table inscriptions
CREATE TABLE IF NOT EXISTS public.inscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom_complet TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT NOT NULL,
    ville TEXT NOT NULL,
    type_formation TEXT NOT NULL CHECK (type_formation IN ('individuelle', 'pack', 'cycle')),
    formation_specifique TEXT NOT NULL,
    prix INTEGER NOT NULL,
    mode_formation TEXT NOT NULL CHECK (mode_formation IN ('presentiel', 'enligne', 'mixte')),
    motivation TEXT NOT NULL,
    centres_interet TEXT[] DEFAULT '{}',
    accepte_conditions BOOLEAN NOT NULL DEFAULT false,
    status TEXT DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'confirme', 'annule')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Créer un index sur l'email pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_inscriptions_email ON public.inscriptions(email);

-- Créer un index sur la date de création
CREATE INDEX IF NOT EXISTS idx_inscriptions_created_at ON public.inscriptions(created_at DESC);

-- Activer RLS (Row Level Security)
ALTER TABLE public.inscriptions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion (tout le monde peut s'inscrire)
CREATE POLICY "Permettre insertion inscriptions" ON public.inscriptions
    FOR INSERT WITH CHECK (true);

-- Politique pour permettre la lecture (pour l'administration)
CREATE POLICY "Permettre lecture inscriptions" ON public.inscriptions
    FOR SELECT USING (true);

-- Politique pour permettre la mise à jour (pour l'administration)
CREATE POLICY "Permettre mise à jour inscriptions" ON public.inscriptions
    FOR UPDATE USING (true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_inscriptions_updated_at 
    BEFORE UPDATE ON public.inscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Commentaires pour la documentation
COMMENT ON TABLE public.inscriptions IS 'Table des inscriptions aux formations Third Eyes Co.';
COMMENT ON COLUMN public.inscriptions.centres_interet IS 'Array des centres d''intérêt sélectionnés';
COMMENT ON COLUMN public.inscriptions.status IS 'Statut de l''inscription: en_attente, confirme, annule';