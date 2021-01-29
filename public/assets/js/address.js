$(document).ready(function(){
	
	function limpa_formulario_cep() {
		$('#street').val();
		$('#neighb').val();
		$('#city').val();
		$('#state').val();
		$('#complement').val();
		$('#referencePoint').val();
	}

	$('.zipCode').on('change', function(){

		var cep = $(this).val().replace(/\D/g, '');
		if(cep){	
			var validacep = /^[0-9]{8}$/;
			if(validacep.test(cep)) {
				$.ajax({
					url:'https://api.postmon.com.br/v1/cep/'+cep,
					type:'GET',
					dataType:'json',
					success:function(json){
						if (typeof json.bairro !='undefined') {
							$('#street').val(json.logradouro);
							$('#neighb').val(json.bairro);
							$('#city').val(json.cidade);
							$('#state').val(json.estado);

							if(typeof json.logradouro == 'undefined'){
								$('#street').focus();
							} else {
								$('#number').focus();
							}
						}
					}
				});

				$('.street').removeClass("d-none");
				$('.number').removeClass("d-none");
				$('.neighb').removeClass("d-none");
				$('.city').removeClass("d-none");
				$('.state').removeClass("d-none");
				$('.complement').removeClass("d-none");
				$('.referencePoint').removeClass("d-none");
				
			}else{
				limpa_formulario_cep();
			
			}
		}else{
			limpa_formulario_cep();
			
		}
	});
});

