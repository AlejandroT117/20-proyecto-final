const ModelFactory = require("../models/model.factory")
const cartModel = ModelFactory.getModel('cart');

const logger = require('../log')

module.exports ={
  showConfig: async (req,res)=>{
    const user = req.user
    const cartById = await cartModel.getByUserId(user.id);
  
    res.render('config', {user, cartById})
  },
  saveImg: (req, res)=>{
    if(req.file){
      logger.log(`Imagen guardada: ${req.user.id}`)
    }
  
    res.redirect('/config')
  }

}