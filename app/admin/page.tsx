'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/browser'

type Profile = { id: string; username: string; name: string; bio: string; avatar_url: string }
type LinkRow = { id: string; title: string; url: string; position: number }

export default function Admin() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [links, setLinks] = useState<LinkRow[]>([])
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [addingLink, setAddingLink] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!p) return router.push('/login')

      setProfile(p)
      setName(p.name ?? '')
      setBio(p.bio ?? '')
      setAvatarUrl(p.avatar_url ?? '')

      const { data: l } = await supabase.from('links').select('*').eq('profile_id', user.id).order('position')
      setLinks(l ?? [])
    }
    load()
  }, [])

  const saveProfile = async () => {
    if (!profile) return
    setSaving(true)
    await supabase.from('profiles').update({ name, bio, avatar_url: avatarUrl }).eq('id', profile.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addLink = async () => {
    if (!profile || !newTitle || !newUrl) return
    setAddingLink(true)
    const normalizedUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`
    const { data } = await supabase.from('links').insert({
      profile_id: profile.id,
      title: newTitle,
      url: normalizedUrl,
      position: links.length,
    }).select().single()
    if (data) setLinks(prev => [...prev, data])
    setNewTitle('')
    setNewUrl('')
    setShowAddForm(false)
    setAddingLink(false)
  }

  const deleteLink = async (id: string) => {
    await supabase.from('links').delete().eq('id', id)
    setLinks(prev => prev.filter(l => l.id !== id))
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!profile) return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
      <p className="text-[#333] text-sm">Chargement...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e8e8e8] flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6 max-w-3xl mx-auto w-full">
        <span className="text-sm font-semibold text-white">Vyn</span>
        <div className="flex items-center gap-5 text-xs text-[#555]">
          <Link href={`/${profile.username}`} target="_blank" className="hover:text-[#e8e8e8] transition-colors">
            Voir ma page →
          </Link>
          <button onClick={logout} className="hover:text-[#e8e8e8] transition-colors">Déconnexion</button>
        </div>
      </nav>

      <div className="h-px bg-[#1a1a1a] max-w-3xl mx-auto w-full" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-8 py-12 flex flex-col gap-12">

        {/* Profile */}
        <section>
          <p className="text-[10px] text-[#444] uppercase tracking-widest mb-6">Profil</p>
          <div className="flex flex-col gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              className="w-full border border-[#222] rounded-xl bg-[#0f0f0f] px-5 py-4 text-sm focus:outline-none focus:border-[#333] placeholder-[#333] text-[#e8e8e8] transition-colors"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio (optionnel)"
              rows={2}
              className="w-full border border-[#222] rounded-xl bg-[#0f0f0f] px-5 py-3 text-sm focus:outline-none focus:border-[#333] placeholder-[#333] text-[#e8e8e8] transition-colors resize-none"
            />
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="URL de votre avatar (optionnel)"
              className="w-full border border-[#222] rounded-xl bg-[#0f0f0f] px-5 py-4 text-sm focus:outline-none focus:border-[#333] placeholder-[#333] text-[#e8e8e8] transition-colors"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-white text-black px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#e8e8e8] disabled:opacity-30 transition-colors"
              >
                {saving ? 'Sauvegarde...' : saved ? '✓ Sauvegardé' : 'Sauvegarder'}
              </button>
              <span className="text-xs text-[#444]">vyn.app/{profile.username}</span>
            </div>
          </div>
        </section>

        <div className="h-px bg-[#1a1a1a]" />

        {/* Links */}
        <section>
          <p className="text-[10px] text-[#444] uppercase tracking-widest mb-6">Liens</p>

          <div className="flex flex-col gap-2 mb-4">
            {links.length === 0 && !showAddForm && (
              <p className="text-sm text-[#333] py-2">Aucun lien pour l&apos;instant.</p>
            )}
            {links.map((link) => (
              <div key={link.id} className="flex items-center gap-3 border border-[#1a1a1a] rounded-xl px-4 py-3 bg-[#0f0f0f] group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#e8e8e8] truncate">{link.title}</p>
                  <p className="text-xs text-[#444] truncate font-mono">{link.url}</p>
                </div>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="text-[#333] hover:text-red-500 transition-colors text-xs opacity-0 group-hover:opacity-100"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>

          {showAddForm && (
            <div className="flex flex-col gap-2 mb-3">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Titre du lien"
                autoFocus
                className="w-full border border-[#222] rounded-xl bg-[#0f0f0f] px-5 py-4 text-sm focus:outline-none focus:border-[#333] placeholder-[#333] text-[#e8e8e8] transition-colors"
              />
              <div className="flex gap-2">
                <input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addLink()}
                  placeholder="https://..."
                  className="flex-1 border border-[#222] rounded-xl bg-[#0f0f0f] px-5 py-4 text-sm focus:outline-none focus:border-[#333] placeholder-[#333] text-[#e8e8e8] transition-colors"
                />
                <button
                  onClick={addLink}
                  disabled={addingLink || !newTitle || !newUrl}
                  className="bg-white text-black px-5 rounded-xl text-sm font-semibold hover:bg-[#e8e8e8] disabled:opacity-20 transition-colors"
                >
                  →
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowAddForm(v => !v)}
            className="text-xs text-[#444] hover:text-[#888] transition-colors"
          >
            {showAddForm ? '− Annuler' : '+ Ajouter un lien'}
          </button>
        </section>
      </main>
    </div>
  )
}
