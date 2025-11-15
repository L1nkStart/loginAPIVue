import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold">
              Sistema de Autenticación
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Acceso seguro a tu cuenta con Supabase. Login rápido, registro sencillo y panel de control personalizado.
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-8">
            <Link href="/auth/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Crear Cuenta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
