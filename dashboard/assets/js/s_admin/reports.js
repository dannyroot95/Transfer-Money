
var valuesToPrint
var sum 
var sum2

document.addEventListener("DOMContentLoaded", (_) => {
    document.getElementById("mySelect").addEventListener("change", (e) => {
      showDivs(e.target.value);
    });
  });

showAllData()

function showDivs(value){

	if(value == "0"){
		document.getElementById("btnPrint").style = "display:none;"
		document.getElementById("divPerSpecificDate").style = "display:none;"
		document.getElementById("divPerRange").style = "display:none;"
		document.getElementById("divPerMonth").style = "display:none;"
		showAllData()
	}
	if(value == "1"){
		document.getElementById("btnPrint").style = "display:none;"
		document.getElementById("divPerSpecificDate").style = "display:inline;"
		document.getElementById("divPerRange").style = "display:none;"
		document.getElementById("divPerMonth").style = "display:none;"
	}
	if(value == "2"){
		document.getElementById("btnPrint").style = "display:none;"
		document.getElementById("divPerSpecificDate").style = "display:none;"
		document.getElementById("divPerRange").style = "display:inline;"
		document.getElementById("divPerMonth").style = "display:none;"
	}
	if(value == "3"){
		document.getElementById("btnPrint").style = "display:none;"
		document.getElementById("divPerSpecificDate").style = "display:none;"
		document.getElementById("divPerRange").style = "display:none;"
		document.getElementById("divPerMonth").style = "display:inline;"
	}

}
function showSpinner(){
   document.getElementById("divver").style = "display:block"
}

function hideSpinner(){
	document.getElementById("divver").style = "display:none"
}

function showAllData(){

	showSpinner()

	db.collection("transfers")
	.where("date_of_issue", "<=", Date.now())
	.orderBy("date_of_issue", "asc").limit(100).get().then((snapshot) =>{

		var c = 0
		var dataAmount = []
		var dataCommission = []
		var dates = []
		valuesToPrint = []

		snapshot.forEach(e => {
			c++
			var commission = parseInt((e.data().commission),10)
			var amountSend = parseInt((e.data().amount_send),10)
			var dateEmision = e.data().date_of_issue
			dataAmount.push(amountSend)
			dataCommission.push(commission)
			dates.push(onlyDateNumber(dateEmision))
			valuesToPrint.push([c,onlyDateNumber(dateEmision),amountSend,commission])
		});

		if(c == 0){
			zingchart.exec('myChart','destroy');
			hideSpinner()
			Swal.fire(
				'Oops!',
				'No existen datos!',
				'warning'
			  )
			  document.getElementById("no-money").style = "display:inline;"
			  document.getElementById("btnPrint").style = "display:none;color:#fff;"
		}else{
			document.getElementById("no-money").style = "display:none;"
			document.getElementById("btnPrint").style = "display:inline;color:#fff;"
		}

           showGraph(dataAmount,dataCommission,dates)
	
	  })

}


function showSpecificDate(){

		var value = document.getElementById("date_end").value

		if(value != ""){

			var init = value+" "+"00:01:00"
			var final = value+" "+"23:59:59"
	
			var date1 = new Date(init);
			var timestamp1 = date1.getTime();
			
			var date2 = new Date(final);
			var timestamp2 = date2.getTime();
	
			filterDatabase(timestamp1,timestamp2)
		}else{
			document.getElementById("myChart").style = "display:none;"
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'Seleccione una fecha!',
				
			  })
			  document.getElementById("myChart").style = "display:block;"
		}
	
}

function showDatePerRange(){

	var date = document.getElementById("datepicker").value

	if(date != ""){
		var datesplit = date.split(" - ")

		var splitter = datesplit[0].split("/")
		var date1 = splitter[1]+"/"+splitter[0]+"/"+splitter[2]
	
		var splitter2 = datesplit[1].split("/")
		var date2 = splitter2[1]+"/"+splitter2[0]+"/"+splitter2[2]
	
		filterDatabase(toTimestamp(date1),toTimestamp(date2))
	}else{
		document.getElementById("myChart").style = "display:none;"
		Swal.fire({
			icon: 'warning',
			title: 'Oops...',
			text: 'Seleccione las fechas!',
			
		  })
		  document.getElementById("myChart").style = "display:block;"
	}
	
}

function showDataPerMonth(){

	var dateOfMonth = document.getElementById("start").value
	if(dateOfMonth != ""){
		var ds = dateOfMonth.split("-")

		var month = ds[1]
		var year = ds[0]
	
		const firstDay = new Date(year, (month-1), 1);
		const lastDay = new Date(year, (month-1) + 1, 0);
	
		filterDatabase(toTimestamp(firstDay),toTimestamp(lastDay))
	}else{
		document.getElementById("myChart").style = "display:none;"
		Swal.fire({
			icon: 'warning',
			title: 'Oops...',
			text: 'Seleccione un mes!',
			
		  })
		  document.getElementById("myChart").style = "display:block;"
	}

	}

function filterDatabase(timestamp1,timestamp2){

	showSpinner()

	db.collection("transfers").where("date_of_issue", ">=", timestamp1)
	.where("date_of_issue", "<=", timestamp2).get().then((snapshot) =>{

		var c = 0
		var dataAmount = []
		var dataCommission = []
		var dates = []
		valuesToPrint = []
		snapshot.forEach(e => {
			c++
			var commission = parseInt((e.data().commission),10)
			var amountSend = parseInt((e.data().amount_send),10)
			var dateEmision = e.data().date_of_issue
			dataAmount.push(amountSend)
			dataCommission.push(commission)
			dates.push(onlyDateNumber(dateEmision))
			valuesToPrint.push([c,onlyDateNumber(dateEmision),amountSend,commission])
		});

		if(c == 0){
            zingchart.exec('myChart','destroy');
			hideSpinner()
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'No se encontraron datos!',
				
			  })
			  document.getElementById("no-money").style = "display:inline;"
			  document.getElementById("btnPrint").style = "display:none;color:#fff;"
		}else{
			document.getElementById("no-money").style = "display:none;"
			document.getElementById("btnPrint").style = "display:inline;color:#fff;"
		}

	
		showGraph(dataAmount,dataCommission,dates)
	
	  })
}	

	
function toTimestamp(strDate){
	var datum = Date.parse(strDate);
	return datum;
 }
   

function onlyDateNumber(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();

      if(date <=9){
        date = "0"+date
      }
    var time = date + '/' + month + '/' + year;
    return time;
  }

  function onlyHour(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();

    var stringhour = hour
    var stringmin = min
    var stringseg = sec

    if(hour <=9){
      stringhour = "0"+hour
   }
    if(min <=9){
       stringmin = "0"+min
    }
    if(sec <=9){
      stringseg = "0"+sec
    }

    var time = stringhour + ':' + stringmin ;

    return time;
  }

function splitter(value){
    value.split(" ")
	return value
}  

function showGraph(amount,commission,dates){

	const reducer = (accumulator, curr) => accumulator + curr;
	sum = amount.reduce(reducer);
	sum2 = commission.reduce(reducer);
	
	var myConfig = {
	
		graphset: [{
			type: 'line',
			subtitle: {
				text: 'Monto de transferencias',
			  },
			scaleX: {
			  labels: dates,
			  label: {
				text: 'Total : S/'+sum
			  }
			},
			tooltip: {
			  textAlign: 'left',
			  text: 'Fecha : %kt<br>Monto : S/%v'
			},
			  series: [
				  {
					  values: amount,
					  'line-color': "#5BBD00",
					  dataDates: dates, // one for each point in values array
					  marker:   { /* Marker object */
					  'background-color': "#FF0066", /* hexadecimal or RGB value */
					   size:5, /* in pixels */
					  'border-color': "#5bbd00", /* hexadecimal or RBG value */
					  'border-width':3 /* in pixels */
				  }
				}
			  ]
		},
		{
			type: 'line',
			scaleX: {
			  labels: dates,
			  label: {
				text: 'Total : S/'+sum2
			  }
			},
			subtitle: {
				text: 'Ganancia de comisiones',
			  },
			tooltip: {
			  textAlign: 'left',
			  text: 'Fecha : %kl<br>Comisión : S/%v'
			},
			  series: [
				  {
					  values: commission,
					  'line-color': "#6666FF",
					  dataDates: dates, // one for each point in values array
					  marker:   { /* Marker object */
									'background-color': "#FF0066", /* hexadecimal or RGB value */
								  size:5, /* in pixels */
									'border-color': "#6666FF", /* hexadecimal or RBG value */
								 'border-width':3 /* in pixels */
								}
				  }
			  ]
		}
	]
	 
	};
	zingchart.render({ 
		id: 'myChart', 
		data: myConfig, 
		height: '100%', 
		width: '100%' 
	});
	hideSpinner()
}


  function print(){
	var ds = "Reporte de montos y comisiones"
    printData(ds,valuesToPrint)
  }

  function printData(text,array){

	var data = localStorage.getItem("localeData")
	var json = JSON.parse(data)
  
	
	var doc = new jspdf.jsPDF()
	doc.setFontSize(26)
	doc.text(30, 16, json.name_local)
	doc.setFontSize(8)
	doc.text(30, 22, "Fecha de generacion del reporte : "+onlyDateNumber(Date.now()))
	doc.setFontSize(9)
	doc.text(155, 14, "RUC : "+json.ruc)
	doc.text(155, 19, "Direccion : "+json.address)
	doc.text(155, 24, "Teléfono : "+json.phone_profile)
	doc.setFontSize(14)
	doc.text(65, 38, text)

	doc.setFontSize(12)
	
	doc.addImage(json.image, 'JPEG', 7, 2, 20, 20)
    doc.autoTable({
    head: [['#','Fecha de emision','Monto','Comisión']],
    body: array,
    theme: 'grid',
	styles : { halign : 'center'},
	 headStyles :{fillColor : [212, 172, 13]}, 
	 alternateRowStyles: {fillColor : [255, 241, 184]}, 
	 tableLineColor: [212, 172, 13], 
	 tableLineWidth: 0.1,
	 margin: {top: 43},
    })
	doc.text('Total Monto : '+"S/"+sum, 152, doc.lastAutoTable.finalY + 20)
	doc.text('Total Comision : '+"S/"+sum2, 152, doc.lastAutoTable.finalY + 28)
    doc.save('Reporte general.pdf')

  }


