const admin = require('firebase-admin')
const {getFirestore} = require('firebase-admin/firestore')
const serviceAccount = require('../firebase/sdk.json')
const { getDatabase, ref, set } = require("firebase/database");
const fs = require('fs').promises
const path = require('path')

class ContenedorFb{
  constructor(){
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://'
    }),
    this.db = getFirestore()
    this.query = this.db.collection('products')
  }

  async loadData(filename){
    try{
      const raw = await fs.readFile(path.join(__dirname, filename), 'utf-8')
      const productos = JSON.parse(raw)
      let i=0
      for(const p of productos){
        console.log(p)
        this.save(p)
        i++
      }
  
      console.log('data cargada en db')
      return i
    }catch(e){
      console.log(`Error cargando datos: ${e}`)
    }
  }

  async getAll(orderBy='', search='') {
    try{
      if(search){
        const data = await this.query.where('nombre', '==', search).get()
      }else if(orderBy){
        const data = await this.query.orderBy('orderBy', 'desc').get()
      }else{
        const data = await this.query.get()
      }


      return data.docs.map((p)=>{
        console.log(p.id)
        return {
          data: p.data(),
          id: p.id
        }
      })
    }catch(e){
      console.log(`Error en get all ${e}`)
    }
  }

  async getById(id){
    try{
      const data = await this.query.doc(id).get()

      return {data: data.data(), id: data.id}
    }catch(e){
      console.log(`Error en get by id: ${e}`)
    }
  }

  async save(new_object){
    try{
      const product = this.query.doc().set(new_object)
      return product
    }catch(e){
      console.log(`Error creando producto: ${e}`)
      return e
    }

  }

  async editById(id, new_object){
    try{
      const data = await this.query.doc(id).update(new_object)

      return data.data()
    }catch(e){
      console.log(e)
    }

  }

  async deleteById(id){
    try{
      const data = await this.query.doc(id).delete()

      return data
    }catch(e){  
      console.log(`Error en borrado por id ${e}`)
    }
  }

  async deleteAll(){
    try{
      const snapshot = await this.query.get();
      const batch = this.db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      return batch
    }catch(e){
      console.log(`Error borrando todos los productos ${e}`)
    }
  }


}


module.exports = new ContenedorFb()