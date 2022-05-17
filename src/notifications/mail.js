const nodemailer = require('nodemailer')
const moment = require('moment')

const {GMAIL_ADDRESS, GMAIL_PWD} = require('../config').mail
console.log(GMAIL_ADDRESS, GMAIL_PWD)
const logger = require('../log')
class MailSender {

  constructor(){
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
          user: GMAIL_ADDRESS,
          pass: GMAIL_PWD
      }
    });
  } 
  
  async send(productos, email) {
    const template = `
      <h1 style="color: blue;"> Tu pedido esta siendo procesado </h1>
      <p>Aqui tus productos: </p>
      <ul>
        ${productos.join(" ")}
      </ul>
    `

    const mailOptions = {
      from: "Notifaciones de mi tienda <noreply@thepower.com>",
      subject: "Tu pedido en la tienda de bicicletas",
      to: email,
      html: template,
      attachments: [{
        path: __dirname + '/pedido.webp'
      }]
    }

    const response = await this.transporter.sendMail(mailOptions)
    logger.log(`Email status new buy: ${JSON.stringify(response)}`)
  }

  async newUserMail({firstname, lastname, email}){
    
    const template = `
      <h1 style="color: blue;"> Nuevo usuario ${email}</h1>
      <h2> ${firstname} ${lastname}</h2>
      <h3>${moment().format('MMMM D YYYY, h:mm:ss a')}</h3>
    `
    const mailOptions ={
      from: "Notifaciones de mi tienda <noreply@thepower.com>",
      subject: "Nuevo usuario registrado",
      to: GMAIL_ADDRESS,
      html: template
    }

    const response = await this.transporter.sendMail(mailOptions)
    logger.log(`Email status new user: ${JSON.stringify(response)}`)
  }
}
module.exports = new MailSender()