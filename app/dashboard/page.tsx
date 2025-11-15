import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/auth/login')
  }

  const handleLogout = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
            <p className="text-slate-600 mt-2">Bienvenido de vuelta</p>
          </div>
          <form action={handleLogout}>
            <Button variant="outline">Cerrar Sesión</Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Cuenta</CardTitle>
              <CardDescription>Detalles de tu perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Correo Electrónico</p>
                <p className="text-lg font-semibold text-slate-900">{data.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">ID de Usuario</p>
                <p className="text-sm font-mono text-slate-600">{data.user.id}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado de Sesión</CardTitle>
              <CardDescription>Información de tu sesión actual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Autenticado</p>
                <p className="text-lg font-semibold text-green-600">✓ Sí</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Último Login</p>
                <p className="text-sm text-slate-600">
                  {new Date(data.user.last_sign_in_at || '').toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
