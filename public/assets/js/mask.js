$(document).ready(function(){

	$('.zipCode').mask('00000-000');
  $('.saleValue, .condominiumValue, .iptuValue').mask("#.##0,00", {reverse: true});
  $('.dateformat').mask('00/00/0000');
  
    var phone =  $('.phone').val();
    var SPMaskBehavior = function (phone) {
        return phone.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
      },
      spOptions = {
        onKeyPress: function(phone, e, field, options) {
            field.mask(SPMaskBehavior.apply({}, arguments), options);
          }
      };

     
          
      
      $('.phone').mask(SPMaskBehavior, spOptions);

});
$(document).on("focus", ".numberformat", function() { 
    $(this).mask('00000000000000000');
 });

