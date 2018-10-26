import { createTransport } from 'nodemailer'
import { email as emailConfig } from '../../config'

const sendEmail = option => {
  const { address, subject, html } = option
  const { service, sender, pass } = emailConfig

  const transport = createTransport({
    service,
    auth: {
      user: sender,
      pass
    }
  })
  const mailOptions = {
    from: sender,
    to: address,
    subject,
    html
  }
  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
      } else {
        resolve(`Message sent ${info.response}`)
      }
    })
  })
}

export default sendEmail
