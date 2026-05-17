import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Finanzas App <onboarding@resend.dev>'

export const sendVerificationEmail = async (email: string, name: string, token: string) => {
  const url = `${process.env.APP_URL}/verify-email?token=${token}`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Verifica tu cuenta — Finanzas App',
    html: `
      <div style="font-family: monospace; background: #020809; color: #e8f5f3; padding: 40px; max-width: 500px; margin: 0 auto; border-radius: 16px;">
        <h1 style="color: #00ffc8; font-size: 24px; margin-bottom: 8px;">FINANZAS<span style="color: #e8f5f3">.</span>APP</h1>
        <p style="color: #5a8a82; font-size: 12px; margin-bottom: 32px;">// verificación de cuenta</p>
        
        <p style="margin-bottom: 16px;">Hola <strong>${name}</strong>,</p>
        <p style="color: #5a8a82; margin-bottom: 32px;">
          Gracias por registrarte. Verifica tu email para activar tu cuenta.
        </p>

        <a href="${url}"
          style="display: inline-block; background: #00ffc8; color: #020809; padding: 14px 28px;
          border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">
          Verificar cuenta →
        </a>

        <p style="color: #5a8a82; font-size: 12px; margin-top: 32px;">
          Este link expira en 24 horas.<br/>
          Si no creaste esta cuenta, ignora este email.
        </p>
      </div>
    `,
  })
}

export const sendPasswordResetEmail = async (email: string, name: string, token: string) => {
  const url = `${process.env.APP_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Recupera tu contraseña — Finanzas App',
    html: `
      <div style="font-family: monospace; background: #020809; color: #e8f5f3; padding: 40px; max-width: 500px; margin: 0 auto; border-radius: 16px;">
        <h1 style="color: #00ffc8; font-size: 24px; margin-bottom: 8px;">FINANZAS<span style="color: #e8f5f3">.</span>APP</h1>
        <p style="color: #5a8a82; font-size: 12px; margin-bottom: 32px;">// recuperación de contraseña</p>
        
        <p style="margin-bottom: 16px;">Hola <strong>${name}</strong>,</p>
        <p style="color: #5a8a82; margin-bottom: 32px;">
          Recibimos una solicitud para restablecer tu contraseña. Este link expira en 15 minutos.
        </p>

        <a href="${url}"
          style="display: inline-block; background: #ff4466; color: #fff; padding: 14px 28px;
          border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">
          Restablecer contraseña →
        </a>

        <p style="color: #5a8a82; font-size: 12px; margin-top: 32px;">
          Si no solicitaste esto, ignora este email.<br/>
          Tu contraseña no cambiará.
        </p>
      </div>
    `,
  })
}