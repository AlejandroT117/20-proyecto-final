module.exports = {
  mongoConfig: {
    HOSTNAME: "cluster0.yi6w4.mongodb.net",
    SCHEMA: "mongodb+srv",
    USER: "coderhouse",
    PASSWORD: process.env.MONGO_PWD,
    DATABASE: "ecommerce",
    OPTIONS: "retryWrites=true&w=majority",
  },
  mail: {
    GMAIL_PWD: process.env.GMAIL_PWD,
    GMAIL_ADRESS: process.env.GMAIL_ADRESS
  },
  twilio: {
    TWILIO_AUTH: process.env.TWILIO_AUTH,
    TWILIO_SID: process.env.TWILIO_SID,
    TWILIO_PHONE: process.env.TWILIO_PHONE,
  }
};

/* module.exports={
  HOSTNAME: '127.0.0.1',
  SCHEMA: 'mongodb',
  DATABASE:'ecommerce', 
  DBPORT: 27017,
  OPTIONS: 'readPreference=primary'
} */

/* atlas mongo db */
