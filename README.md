<div align="center">

<br />

```
 __   ___   _ _ __  
 \ \ / / | | | '_ \ 
  \ V /| |_| | | | |
   \_/  \__, |_| |_|
         __/ |      
        |___/       
```

**Votre page de liens personnelle, en quelques secondes.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-green?style=flat-square&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-white?style=flat-square)](LICENSE)

</div>

---

## Présentation

Vyn est une alternative minimaliste à Linktree. Chaque utilisateur crée son compte, choisit son username, et obtient une page publique à l'adresse `vyn.app/username` — avec tous ses liens au même endroit.

Pas de pub, pas de tracking. Multi-utilisateurs, auto-hébergeable, open source.

---

## Fonctionnalités

| | |
|---|---|
| **Page publique** | URL personnalisée `/username` partageable instantanément |
| **Multi-utilisateurs** | Chaque compte a sa propre page isolée |
| **Icônes sociales** | Détection automatique pour 12 plateformes (Instagram, GitHub, TikTok…) |
| **Admin protégé** | Gestion des liens et du profil derrière une authentification |
| **Design minimaliste** | Interface sombre, typographique, sans distraction |
| **Username unique** | Vérification de disponibilité en temps réel à l'inscription |

---

## Stack

```
Next.js 16 (App Router)   →  Framework full-stack
TypeScript                →  Typage statique
Supabase                  →  Auth + base de données PostgreSQL
Tailwind CSS v4           →  Styles utilitaires
simple-icons              →  Icônes vectorielles des plateformes sociales
```

---

## Installation

### Prérequis

- Node.js 18+
- Un projet [Supabase](https://supabase.com) (plan gratuit suffisant)

### 1. Cloner le projet

```bash
git clone https://github.com/lesdavils/vyn.git
cd vyn
npm install
```

### 2. Créer les tables Supabase

Dans **SQL Editor** de votre projet Supabase, exécutez :

```sql
-- Table des profils
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  name text,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Table des liens
create table links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  title text not null,
  url text not null,
  position integer default 0,
  created_at timestamptz default now()
);

-- Politiques RLS
alter table profiles enable row level security;
alter table links enable row level security;

create policy "profiles_public_read" on profiles for select using (true);
create policy "profiles_owner_update" on profiles for update using (auth.uid() = id);

create policy "links_public_read" on links for select using (true);
create policy "links_owner_all" on links for all using (
  auth.uid() = (select profile_id from links where id = links.id)
) with check (auth.uid() = profile_id);

-- Trigger : création automatique du profil à l'inscription
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

### 3. Variables d'environnement

Créez un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

Ces valeurs se trouvent dans **Supabase → Settings → API**.

### 4. Désactiver la confirmation par email *(optionnel)*

Dans **Supabase → Authentication → Providers → Email**, désactivez "Confirm email" pour permettre la connexion immédiate après inscription.

### 5. Lancer

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

---

## Structure du projet

```
vyn/
├── app/
│   ├── [username]/
│   │   └── page.tsx          # Page publique du profil
│   ├── admin/
│   │   └── page.tsx          # Interface de gestion (protégée)
│   ├── api/check-username/
│   │   └── route.ts          # Vérification de disponibilité du username
│   ├── login/
│   │   └── page.tsx          # Connexion
│   ├── register/
│   │   └── page.tsx          # Inscription
│   └── page.tsx              # Landing page
├── lib/
│   ├── platforms.tsx         # Détection + icônes des plateformes sociales
│   └── supabase/
│       ├── browser.ts        # Client Supabase côté navigateur
│       └── server.ts         # Client Supabase côté serveur
├── proxy.ts                  # Protection de la route /admin
└── .env.local                # Variables d'environnement (non commité)
```

---

## Plateformes reconnues

Vyn détecte automatiquement la plateforme depuis l'URL et affiche l'icône correspondante :

```
GitHub · Instagram · LinkedIn · X / Twitter · Snapchat · TikTok
YouTube · Facebook · Discord · Twitch · Spotify · Threads
```

---

## Déploiement

Le plus simple est de déployer sur [Vercel](https://vercel.com) :

1. Importez le repo GitHub sur Vercel
2. Ajoutez les variables d'environnement Supabase dans les settings
3. Deploy

---

## Licence

MIT — libre d'utilisation, de modification et de distribution.
