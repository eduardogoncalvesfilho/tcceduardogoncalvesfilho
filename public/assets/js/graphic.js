$(document).ready(function(){


var rel1 = new Chart(document.getElementById("rel1"), {
	type:'line',
	data:{}
});

fetch('/graphicajax').then(response => response.json()).then(json => {
	rel1.data = {
		labels: json.date,
		datasets: [{
		label: 'Anúncios',
		data: json.count,
		backgroundColor: "rgba(90, 150, 220, 0.85)",
		borderColor: "rgba(70, 120, 180, 1)",
		borderWidth: 2
		}]
	}	;
	rel1.update();
});

var rel2 = new Chart(document.getElementById("rel2"), {
	type:'pie',
	data:{}
});

fetch('/graphicastatusjax').then(response => response.json()).then(json => {
	rel2.data = {
		labels: json.statu,
		datasets: [{
		label: 'Status',
		data: json.count,
		backgroundColor: ['#51aa5e', '#DD3D45']
		}]
	}	;
	rel2.update();
});

});