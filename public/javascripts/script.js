

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
//
//function changeQuantity(cartId,proId,count){
//  $.ajax({
//    url:'/change-product-quantity',
//    data: {
//      cart:cartId,
//      product:proId,
//      count:count
//    },
//    method:'post',
//    success: (resposne) => {
//      alert(resposne)
//    }
//  })
//}