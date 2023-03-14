
function viewImage(event){
  document.getElementById('imgView').src=URL.createObjectURL(event.target.files[0])
}

function addToCart(proID){
  $.ajax({
    url:'/add-to-cart/'+proID,
    method:'get',
    success:(response) =>{
      if(response.status){
        let count= $('#cart-count').html()
        count=parseInt(count)+1
        $("#cart-count").html(count)
      }
    }


  })
} 

function changeQuantity(cartId,proId,count){
  let quantity = parseInt(document.getElementById(proId).innerHTML); 
  count = parseInt(count)
    
    $.ajax({
      url:'/change-product-quantity',
      data: {
        cart:cartId,
        product:proId,
        count:count,
        quantity:quantity
      },
      method:'post',
      success: (resposne) => {
        if(resposne.removeProduct){
          alert("product Removed from cart")
          location.reload()
        }else{
          document.getElementById(proId).innerHTML=quantity+count
        }
      }
    })
}

function removeItem(cartId,proId){
  console.log('remove item function called on frontend')
  $.ajax({
    url:'/remove-item',
    data: {
      cart:cartId,
      product:proId
    },
    method:'post',
    success : () => {
      alert("product removed from cart")
      location.reload()
    }
  })
}