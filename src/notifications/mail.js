const nodemailer = require('nodemailer')
const moment = require('moment')

const {GMAIL_ADDRESS, GMAIL_PWD} = require('../config').mail
const logger = require('../log')
const TEST_MAIL = 'shakira.greenfelder80@ethereal.email'
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

/*     this.transporter= nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: TEST_MAIL,
          pass: 'nJMDQJR1SKXS98pMVb'
      }
    }) */
  } 
  

  async newUserMail({firstname, lastname, email}){
    
    const template = `
      <h1 style="color: blue;"> Nuevo usuario ${email}</h1>
      <h2> ${firstname} ${lastname}</h2>
      <h3>${moment().format('MMMM Do YYYY, h:mm:ss a')}</h3>
    `
    const mailOptions ={
      from: "Notifaciones de mi tienda <noreply@myshop.com>",
      subject: "Nuevo usuario registrado",
      to: TEST_MAIL,
      html: template
    }

    const response = await this.transporter.sendMail(mailOptions)
    logger.log(`Correo enviado ${response}`)
  }
}
module.exports = new MailSender()