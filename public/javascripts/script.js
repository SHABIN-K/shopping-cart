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