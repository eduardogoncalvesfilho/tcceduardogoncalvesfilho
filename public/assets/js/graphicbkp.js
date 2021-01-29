$(document).ready(function(){

    $.ajax({
        url:'/graphicajax',
        type:'GET',
        dataType:'json',
        success:function(response){
            if(response.status!='undefined' || response.status!=null || response.data!=''){

				var convertida = response.status.map(function(obj) {
					return Object.keys(obj).map(function(chave) {
						return obj[chave];
					});
				});

				var dates = response.datas.map(function(obj) {
					return Object.keys(obj).map(function(chave) {
						return obj[chave];
					});
				});
				
			
	
				//moment.locale('pt');
			
			
					//moment(dates).format('DD/MM/YYYY')
					var txt = "";
					dates.forEach(tabuadaDe2);
				
					function tabuadaDe2(value, index, array) {
						//console.log(value[0]);
						txt = txt +(moment(value[0]).format('DD/MM/YYYY')+",");
	
					}
					var splits = txt.split(',');
					console.log(splits);
					
			var rel1 = new Chart(document.getElementById("rel1"), {
				type:'line',
				data:{
					labels:splits,
					datasets:[{
						label:'Anúncios',
						data:['01','02','03','04','05','06','07','08','09','10'],
						fill:false,
						backgroundColor:'#0000FF',
						borderColor:'#0000FF'
					}]
				},
			});
	}
	var rel2 = new Chart(document.getElementById("rel2"),{
		type:'pie',
		data:{
			labels:[convertida[0][0],convertida[1][0]],
			datasets:[{
				data:[convertida[0][1],convertida[1][1]],
				backgroundColor:[ '#34542a','#f3a516']
			}]
		}
	});
	}
});
});

$(document).ready(function(){

    $.ajax({
        url:'/graphicajax',
        type:'GET',
        dataType:'json',
        success:function(response){
            if(response.status!='undefined' || response.status!=null || response.data!=''){

				var convertida = response.status.map(function(obj) {
					return Object.keys(obj).map(function(chave) {
						return obj[chave];
					});
				});

				var dates = response.datas.map(function(obj) {
					return Object.keys(obj).map(function(chave) {
						return obj[chave];
					});
				});
				
			
	
				//moment.locale('pt');
			
			
					//moment(dates).format('DD/MM/YYYY')
					var data = "";
					dates.forEach(tabuadaDe2);
				
					function tabuadaDe2(value, index, array) {
						//console.log(value[0]);
						data = data +(moment(value[0]).format('DD/MM/YYYY')+",");
	
					}
					
					datas.pop();
					var count = 0;
					dates.forEach(countArray);
				
					function countArray(value, index, array) {
						//console.log(value[0]);
						count = count +value[1]+",";
	
					}
					var counts = count.split(',');
					counts.pop();
					

				console.log(datas);
				

				var rel1 = document.getElementById("rel1"),

				// Data
				data = {
					labels: datas,
					datasets: [{
					label: 'Anúncios',
					data: counts,
					backgroundColor: "rgba(90, 150, 220, 0.85)",
					borderColor: "rgba(70, 120, 180, 1)",
					borderWidth: 2
					}],
				},

				// Options
				options = {
					scales: {
					yAxes: [{
						ticks: {

						callback: function(value) {
							return value.toString().replace(/\B(?=(\d{2})+(?!\d))/g, "");
						}
						}
					}]
					}
				};

				chart_trans_hari = new Chart(rel1, {
				type: 'line',
				data: data,
				options: options
				});
	

		var rel2 = new Chart(document.getElementById("rel2"),{
			type:'pie',
			data:{
				labels:[convertida[0][0],convertida[1][0]],
				datasets:[{
					data:[convertida[0][1],convertida[1][1]],
					backgroundColor:[ '#34542a','#f3a516']
				}]
			}
		});
		}

	}
	
});
});