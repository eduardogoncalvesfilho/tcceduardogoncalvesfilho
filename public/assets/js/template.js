$(document).ready(function(){
    $(function() {
        $.getJSON("https://freegeoip.app/json/",
         function(json) {
            var stateUser = (json.region_code);
            $("#state-user").val(stateUser);
         }
        );
    });   

			$('#search').autocomplete({
					source: function(req,res) {
					$.ajax({
						url:'autocomplete/',
						type:'GET',
						dataType:'jsonp',
						data:req,
						success: function(data) {
							res($.map(data, function(item) {
								return {
									
									label: item.label,
									id:item.id
	
									
								};
							}));
						},
						error: function(err) {
							console(err.status);
						}
					});
				},
				minLength:1,
				select: function(event, ui) {
					if(ui.item){
						$("#idAd").val(ui.item.id);
						$("#category").val(ui.item.category);
						
					}
				}
			});

			$.ajax({
				url:'/typejax',
				type:'GET',
				dataType:'json',
				success:function(response){
					if(response.responseJson!='undefined' || response.responseJson!=null || response.data!=''){
						$.each(response.responseJson.type,function(index,type){  
							$('#select-rentAndSale').append("<option value="+type.name+">"+type.name+"</option>");
							
						});
					}else{
						
					}
					
					
				}
			});
					
});

