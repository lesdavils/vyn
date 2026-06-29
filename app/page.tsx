import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e8e8e8] flex flex-col">

      <nav className="flex items-center justify-between px-8 py-6 max-w-5xl mx-auto w-full">
        <img src="/logo.png" alt="Vyn" className="h-12" />
        <div className="flex items-center gap-8 text-sm text-[#666]">
          <Link href="/login" className="hover:text-[#e8e8e8] transition-colors">Connexion</Link>
          <Link href="/register" className="bg-white text-black px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#e8e8e8] transition-colors">
            Créer ma page
          </Link>
        </div>
      </nav>

      <div className="h-px bg-[#1a1a1a] max-w-5xl mx-auto w-full" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-8 pt-20 pb-16 flex flex-col justify-center">

        <p className="text-xs text-[#444] tracking-[0.2em] uppercase mb-10">Bio Link</p>

        <h1 className="text-[clamp(3rem,8vw,6.5rem)] leading-[1] tracking-tight mb-2 font-extralight text-[#e8e8e8]">
          Votre page,
        </h1>
        <h1 className="text-[clamp(3rem,8vw,6.5rem)] leading-[1] tracking-tight mb-12 font-bold text-white">
          tous vos liens.
        </h1>

        <p className="text-[#555] text-base max-w-xs leading-relaxed mb-12">
          Une seule URL pour partager tous vos réseaux, projets et contenus.
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="bg-white text-black px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#e8e8e8] transition-colors"
          >
            Créer ma page →
          </Link>
          <span className="text-xs text-[#333]">Gratuit, sans carte bancaire</span>
        </div>
      </main>

      <div className="h-px bg-[#1a1a1a] max-w-5xl mx-auto w-full" />
      <footer className="max-w-5xl mx-auto w-full px-8 py-5 flex items-center justify-between text-xs text-[#333]">
        <img src="/logo.png" alt="Vyn" className="h-5 opacity-40" />
        <a href="https://github.com/lesdavils/vyn" target="_blank" rel="noopener noreferrer" className="hover:text-[#666] transition-colors">GitHub →</a>
      </footer>
    </div>
  )
}
