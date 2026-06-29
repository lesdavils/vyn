import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username')

  if (!username || !/^[a-zA-Z0-9_-]{2,20}$/.test(username)) {
    return NextResponse.json({ available: false, error: '2-20 caractères, lettres, chiffres, - ou _' })
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username.toLowerCase())
    .maybeSingle()

  return NextResponse.json({ available: !data })
}
