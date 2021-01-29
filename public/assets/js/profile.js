
$(document).ready(function(){
    var phone = $("#phone").val();
    var zipCode = $("#zipCode").val();

    if(phone != '' && zipCode == '')
    {
        $("#collapseOne").removeClass("show");
        $("#collapseTwo").addClass("show");
        $("#zipCode").focus();
    }
    else if (zipCode != '' && phone == '')
    {
      $("#collapseOne").addClass("show");
      $("#collapseTwo").removeClass("show");
      $("#phone").focus();
    }
    else if(phone != '' && zipCode !='')
    {
      $("#collapseOne").addClass("show");
      $("#collapseTwo").removeClass("show");
     
    }
});