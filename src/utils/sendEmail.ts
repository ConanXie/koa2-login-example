import { createTransport, SendMailOptions } from "nodemailer"

export interface MailOptions extends SendMailOptions {
  address: string
}

/**
 * send email by nodemailer
 * @param options
 */
export default function sendEmail(options: MailOptions): Promise<string> {
  const { address, subject, html } = options
  const { EMAIL_SERVICE, EMAIL_SENDER, EMAIL_PASSWORD } = process.env

  const transport = createTransport({
    auth: {
      pass: EMAIL_PASSWORD,
      user: EMAIL_SENDER,
    },
    service: EMAIL_SERVICE,
  })
  const mailOptions = {
    from: EMAIL_SENDER,
    html,
    subject,
    to: address,
  }
  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error.message)
      } else {
        resolve(`Message sent ${info.response}`)
      }
    })
  })
}
