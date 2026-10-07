'use client'

import { useActionState } from 'react'
import { login } from '@/app/[lang]/admin/actions'

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null)
  return (
    <form action={action} className="admin-form" style={{ marginTop: 16 }}>
      <label>
        Contraseña
        <input type="password" name="password" autoComplete="current-password" required />
      </label>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        Entrar
      </button>
      {error && (
        <p className="msg err" role="alert" style={{ flexBasis: '100%' }}>
          {error}
        </p>
      )}
    </form>
  )
}
