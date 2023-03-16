
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

function changeQuantity(cartId, proId, count) {
  let quantity = parseInt(document.getElementById(proId).innerHTML);
  count = parseInt(count);

  $.ajax({
    url: '/change-product-quantity',
    data: {
      cart: cartId,
      product: proId,
      count: count,
      quantity: quantity
    },
    method: 'post',
    success: (response) => {
      if (!response.removeProduct) {
        document.getElementById(proId).innerHTML = quantity + count;
      } else {
        Swal.fire({
          title: 'Removed!',
          text: 'Your item has been removed.',
          icon: 'success',
        }).then(() => {
          location.reload();
        });
      }
    }
  });
}


function removeItem(cartId,proId){
 // console.log('remove item function called on frontend')
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: '/remove-item',
        data: {
          cart: cartId,
          product: proId
        },
        method: 'post',
        success: (response) => {
          if (response.success) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your item has been removed.',
              icon: 'success',
            }).then(() => {
              location.reload();
            });
          }  else {
            console.error('ERROR: Invalid response');
          }
        },
        error: (error) => {
          console.error('ERROR:', error);
        }
      });
    } else if ( 
      result.dismiss === Swal.DismissReason.cancel
    ) {
      Swal.fire(
        'Cancelled',
        'Your item has not been removed. :)',
        'error'
      )
    }
  })
}
