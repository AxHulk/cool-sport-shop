// Sends a registered template via managed email and records the outcome in email_send_log.
import { sendTemplateEmail, type SendTemplateEmailOptions } from './transactional-email-templates/send-email.ts'

// deno-lint-ignore no-explicit-any
export async function sendAndLog(supabase: any, templateName: string, to: string, options: SendTemplateEmailOptions = {}) {
  const log = async (status: string, error_message: string | null = null) => {
    const { error } = await supabase.from('email_send_log').insert({
      message_id: options.idempotencyKey ?? null, template_name: templateName, recipient_email: to, status, error_message,
    })
    if (error) console.error('email_send_log insert failed', { code: error.code, message: error.message })
  }
  try {
    const r = await sendTemplateEmail(templateName, to, options)
    await log(r.sent ? 'sent' : 'suppressed')
    return r
  } catch (e) {
    await log('failed', (e instanceof Error ? e.message : String(e)).slice(0, 1000))
    throw e
  }
}
