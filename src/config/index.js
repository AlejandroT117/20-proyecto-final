module.exports={
  HOSTNAME: "cluster0.yi6w4.mongodb.net",
  SCHEMA: "mongodb+srv",
  USER: "coderhouse",
  PASSWORD: process.env.MONGO_PWD,
  DATABASE: "ecommerce",
  OPTIONS: "retryWrites=true&w=majority"
}

/* module.exports={
  HOSTNAME: '127.0.0.1',
  SCHEMA: 'mongodb',
  DATABASE:'ecommerce', 
  DBPORT: 27017,
  OPTIONS: 'readPreference=primary'
} */

/* atlas mongo db */
