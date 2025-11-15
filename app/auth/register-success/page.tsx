import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function RegisterSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">¡Registro Exitoso!</CardTitle>
              <CardDescription>Verifica tu correo electrónico</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Hemos enviado un enlace de confirmación a tu correo electrónico. Por favor, verifica tu correo y haz clic en el enlace para confirmar tu cuenta.
              </p>
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm underline">
                Volver al inicio de sesión
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
