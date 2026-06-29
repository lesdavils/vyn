'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/browser'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const checkUsername = async (value: string) => {
    if (!value) return setUsernameStatus('idle')
    setUsernameStatus('checking')
    const res = await fetch(`/api/check-username?username=${encodeURIComponent(value)}`)
    const data = await res.json()
    if (data.error) return setUsernameStatus('invalid')
    setUsernameStatus(data.available ? 'available' : 'taken')
  }

  const submit = async () => {
    if (usernameStatus !== 'available') return
    if (!email || !password) return setError('Remplissez tous les champs')
    setError('')
    setLoading(true)

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: username.toLowerCase() } },
    })

    setLoading(false)

    if (signUpError || !data.user) {
      return setError(signUpError?.message ?? 'Erreur lors de l\'inscription')
    }

    router.push('/admin')
  }

  const usernameHint = {
    idle: null,
    checking: <span className="text-[#444]">Vérification...</span>,
    available: <span className="text-green-500">✓ Disponible</span>,
    taken: <span className="text-red-500">✗ Déjà pris</span>,
    invalid: <span className="text-red-500">✗ 2-20 caractères, lettres/chiffres/-/_</span>,
  }[usernameStatus]

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e8e8e8] flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6 max-w-5xl mx-auto w-full">
        <Link href="/" className="text-sm font-semibold tracking-wide text-white">Vyn</Link>
      </nav>
      <div className="h-px bg-[#1a1a1a] max-w-5xl mx-auto w-full" />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm py-16">
          <p className="text-xs text-[#444] tracking-[0.2em] uppercase mb-8">Créer un compte</p>
          <h1 className="text-2xl font-bold text-white mb-8">Votre page en 30 secondes.</h1>

          <div className="flex flex-col gap-3">
            <div>
              <div className="flex border border-[#222] rounded-xl overflow-hidden bg-[#0f0f0f] focus-within:border-[#333] transition-colors">
                <span className="pl-4 flex items-center text-[#444] text-sm">vyn.app/</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '')
                    setUsername(v)
                    checkUsername(v)
                  }}
                  placeholder="username"
                  className="flex-1 bg-transparent px-2 py-4 text-sm focus:outline-none placeholder-[#333] text-[#e8e8e8] font-mono"
                />
              </div>
              {usernameHint && <p className="text-xs mt-1.5 ml-1">{usernameHint}</p>}
            </div>

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
              disabled={loading || usernameStatus !== 'available'}
              className="bg-white text-black py-4 rounded-xl text-sm font-semibold hover:bg-[#e8e8e8] disabled:opacity-20 disabled:cursor-not-allowed transition-colors mt-1"
            >
              {loading ? 'Création...' : 'Créer ma page →'}
            </button>
          </div>

          <p className="text-xs text-[#444] mt-6 text-center">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-[#888] hover:text-white transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
