$(document).ready(function(){
    var typeImmobileEdit = $('.typeImmobileEdit').val();
   
    var typeEdit = $('.typeEdit').val();
    if(typeEdit == 'Residencial'){
        $.ajax({
            url:'/categorysresidentialajax',
            type:'GET',
            dataType:'json',
            success:function(response){
                if(response.responseJson!='undefined' || response.responseJson!=null || response.data!=''){


                    $('#select-residential').html(`<option value="" selected>Tipo Residencial *</option>`);
                    $.each(response.responseJson.category,function(index,category){  
                        if(category.name == typeImmobileEdit){
                            var selected = "selected";
                          }   else{
                            var selected ="";
                          }  
                        $('#select-residential').append("<option value="+category.name+" "+selected+">"+category.name+"</option>");
                        
                    });
                }else{
                  
                }
                
                
            }
        });
    }else if(typeEdit == 'Comercial'){
        $.ajax({
			url:'/categoryscommercialajax',
			type:'GET',
			dataType:'json',
			success:function(response){
				if(response.responseJson!=undefined || response.responseJson!=null || response.data!=''){
                    $('#select-residential').html(`<option value="" selected>Tipo Comercial *</option>`);
					$.each(response.responseJson.category,function(index,category){  
                        if(category.name == typeImmobileEdit){
                            var selected = "selected";
                          } else{
                            var selected ="";
                          }    
        
                        $('#select-residential').append("<option value="+category.name+" "+selected+">"+category.name+"</option>");
						
					});
	
				}else{
			
					
				}
				
				
			}
		});
    }
	$("#type-commercial").change(function(){
		$('#select-residential').empty(); 
		$.ajax({
			url:'/categoryscommercialajax',
			type:'GET',
			dataType:'json',
			success:function(response){
				if(response.responseJson!=undefined || response.responseJson!=null || response.data!=''){
					$('#select-residential').html(`<option value="" selected>Tipo Comercial *</option>`);
					$.each(response.responseJson.category,function(index,category){  
                        if(category.name == typeImmobileEdit){
                            var selected = "selected";
                          } else{
                            var selected ="";
                          }   
						$('#select-residential').append("<option value="+category.name+" "+selected+">"+category.name+"</option>");
						
					});
	
				}else{
			
					
				}
				
				
			}
		});
	  });
	
	  $("#type-residential").change(function(){
		$('#select-residential').empty(); 
		$.ajax({
			url:'/categorysresidentialajax',
			type:'GET',
			dataType:'json',
			success:function(response){
				if(response.responseJson!='undefined' || response.responseJson!=null || response.data!=''){
                    $('#select-residential').html(`<option value="" selected>Tipo Residencial *</option>`);
               
                     
					$.each(response.responseJson.category,function(index,category){  
                        if(category.name == typeImmobileEdit){
                            var selected = "selected";
                          }else{
                              
                            var selected ="";
                          }   
						$('#select-residential').append("<option value="+category.name+" "+selected+">"+category.name+"</option>");
						
					});
				}else{
				
				}
				
				
			}
		});
      });

      var rentAndSale = $('.rentAndSale').val();
      $.ajax({
        url:'/typejax',
        type:'GET',
        dataType:'json',
        success:function(response){
            if(response.responseJson!='undefined' || response.responseJson!=null || response.data!=''){
				$('#select-rentAndSale').html(`<option value="" selected>Tipo Anúncio *</option>`);
                $.each(response.responseJson.type,function(index,type){  
                    if(type.name == rentAndSale){
                        var selected = "selected";
                      }else{
                          
                        var selected ="";
                      }   
                      $('#select-rentAndSale').append("<option value="+type.name+" "+selected+">"+type.name+"</option>");
                  
                    
                });
            }else{
                
            }
            
            
        }
    });

});



