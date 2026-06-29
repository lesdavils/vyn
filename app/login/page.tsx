'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/browser'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async () => {
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setError('Email ou mot de passe incorrect')
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e8e8e8] flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6 max-w-5xl mx-auto w-full">
        <Link href="/" className="text-sm font-semibold tracking-wide text-white">Vyn</Link>
      </nav>
      <div className="h-px bg-[#1a1a1a] max-w-5xl mx-auto w-full" />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm py-16">
          <p className="text-xs text-[#444] tracking-[0.2em] uppercase mb-8">Connexion</p>
          <h1 className="text-2xl font-bold text-white mb-8">Content de vous revoir.</h1>

          <div className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border border-[#222] rounded-xl bg-[#0f0f0f] px-5 py-4 text-sm focus:outline-none focus:border-[#333] placeholder-[#333] text-[#e8e8e8] transition-colors"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="Mot de passe"
              className="w-full border border-[#222] rounded-xl bg-[#0f0f0f] px-5 py-4 text-sm focus:outline-none focus:border-[#333] placeholder-[#333] text-[#e8e8e8] transition-colors"
            />

            {error && <p className="text-red-500/80 text-xs">{error}</p>}

            <button
              onClick={submit}
              disabled={loading}
              className="bg-white text-black py-4 rounded-xl text-sm font-semibold hover:bg-[#e8e8e8] disabled:opacity-20 disabled:cursor-not-allowed transition-colors mt-1"
            >
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </div>

          <p className="text-xs text-[#444] mt-6 text-center">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-[#888] hover:text-white transition-colors">
              Créer ma page
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
