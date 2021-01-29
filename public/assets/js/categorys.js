$(document).ready(function(){

    $.ajax({
        url:'/categorysresidentialajax',
        type:'GET',
        dataType:'json',
        success:function(response){
            if(response.responseJson!='undefined' || response.responseJson!=null || response.data!=''){
				$('#select-residential').html(`<option value="" selected>Tipo Residencial *</option>`);
                $.each(response.responseJson.category,function(index,category){  
					
                    $('#select-residential').append("<option value="+category.name+">"+category.name+"</option>");
                    
                });
            }else{
                
            }
            
            
        }
    });
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
						$('#select-residential').append("<option value="+category.name+">"+category.name+"</option>");
						
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
	
						$('#select-residential').append("<option value="+category.name+">"+category.name+"</option>");
						
					});
				}else{
				
				}
				
				
			}
		});
	  });

	  $.ajax({
        url:'/typejax',
        type:'GET',
        dataType:'json',
        success:function(response){
            if(response.responseJson!='undefined' || response.responseJson!=null || response.data!=''){
				$('#select-rentAndSale').html(`<option value="" selected>Tipo Anúncio *</option>`);
                $.each(response.responseJson.type,function(index,type){  
					
                    $('#select-rentAndSale').append("<option value="+type.name+">"+type.name+"</option>");
                    
                });
            }else{
                
            }
            
            
        }
    });



});


