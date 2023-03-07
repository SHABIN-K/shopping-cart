    $(document).ready( function () {
    $('#product-table').DataTable();
    } );  
    function viewImage(event){
      document.getElementById('imgView').src=URL.createObjectURL(event.target.files[0])
    }