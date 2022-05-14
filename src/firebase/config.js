
(async ()=>{

  console.log('IFE')

  const admin = require('firebase-admin')
  const {getFirestore} = require('firebase-admin/firestore')

  const serviceAccount = require('./sdk.json')

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://'
  })

  console.log('CONECTADO')
  
  const db = getFirestore()

  const query = db.collection('movies')
  const data = await query.get()

  let docs = data.docs

  for(let d of docs){
    console.log(d.data(), d.id)
  }

})()