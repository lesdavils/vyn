import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

type Props = { params: Promise<{ username: string }> }

export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username.toLowerCase())
    .single()

  if (!profile) notFound()

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('position')

  const initials = (profile.name ?? profile.username)
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e8e8e8] flex flex-col items-center justify-start px-4 py-20">
      <div className="w-full max-w-sm flex flex-col items-center">

        {/* Avatar */}
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.name}
            className="w-20 h-20 rounded-full object-cover border border-[#1a1a1a] mb-5"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border border-[#222] flex items-center justify-center text-xl font-bold text-[#555] mb-5">
            {initials}
          </div>
        )}

        {/* Name + bio */}
        <h1 className="text-xl font-bold text-white mb-1">{profile.name ?? profile.username}</h1>
        {profile.bio && (
          <p className="text-sm text-[#555] text-center max-w-xs mb-8 leading-relaxed">{profile.bio}</p>
        )}
        {!profile.bio && <div className="mb-8" />}

        {/* Links */}
        <div className="w-full flex flex-col gap-3">
          {(links ?? []).map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-[#1e1e1e] rounded-xl px-5 py-4 text-sm text-center text-[#e8e8e8] bg-[#0f0f0f] hover:bg-[#141414] hover:border-[#2a2a2a] transition-all duration-200"
            >
              {link.title}
            </a>
          ))}
          {(links ?? []).length === 0 && (
            <p className="text-xs text-[#333] text-center py-4">Aucun lien pour l&apos;instant.</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16">
          <Link href="/" className="text-xs text-[#2a2a2a] hover:text-[#555] transition-colors">
            Créer ma page sur Vyn
          </Link>
        </div>
      </div>
    </div>
  )
}
