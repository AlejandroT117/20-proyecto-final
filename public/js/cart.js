async function updateCartNumber(userId) {
  const cartNumber = document.getElementById('cartNumber')

  const cartLengthResponse = await fetch(`/api/carrito/${userId}/user`)
  const cart = await cartLengthResponse.json()

  cartNumber.innerText = cart.productos.length
}


async function addToCart(userId, productId) {
  const producto = await fetch(`/api/productos/${productId}`)
  const productParsed = await producto.json()
  
  const res = await fetch(`/api/carrito/${userId}/productos`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({...productParsed})
  })
  if (res.status != 200 && res.status != 201) {
    return
  }

  await updateCartNumber(userId)
}

async function deleteFromCart (userId,productId){
  const res = await fetch(`/api/carrito/${userId}/productos/${productId}`,{
    method: 'DELETE'
  })
  if (res.status != 200 && res.status != 201) {
    return
  }
  await updateCartNumber(userId)
  
  window.location.href='/cart'
}