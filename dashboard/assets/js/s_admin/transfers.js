// Initialize Firebase


var transfers = []
var nameLocale = ""
var existEmissorInDatabase = true
var existReceiverInDatabase = true
var cacheTransfers = localStorage.getItem("dataTransfers")
var tf = JSON.parse(cacheTransfers)
MicroModal.init()

var dataUser = localStorage.getItem("user");
var us = JSON.parse(dataUser)
console.log(us)

if (tf != null && tf != "") {
  getTransfersFromCache();
} else {
  getTransfers();
  getNumberTransfer();
}

var inputDniReceiver = document.getElementById('dni_receiver');
inputDniReceiver.addEventListener('input', updateValueR);
function updateValueR(e) {
    var dni = e.srcElement.value
    if(dni.length == 8){
      if(dni != inputDniEmissor.value){
        getDniReceiverInDatabase(dni)
      }else{
        alert("Son iguales!")
        inputDniReceiver.value = ""
      }  
    }else{
        
      
    }
}

var inputDniEmissor = document.getElementById('dni_emissor');
inputDniEmissor.addEventListener('input', updateValueE);
function updateValueE(e) {
    var dni = e.srcElement.value
    if(dni.length == 8){
      if(dni != inputDniReceiver.value){
        getDniEmissorInDatabase(dni)
      }else{
        alert("Son iguales!")
        inputDniEmissor.value = ""
      }      
    }else{
        
      
    }
}

function getDniEmissorInDatabase(dni){

  document.getElementById("spinnerDNI").style = "display:block;"
  var name = ""

  db.collection("clients").where("dni", "==",dni).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
         name = doc.data().name
    });

    if(name != ""){
      document.getElementById("spinnerDNI").style = "display:none;"
      document.getElementById("name").style = "width: 100%;display: flex;align-items: center;justify-content: space-between;padding-top: 0.5rem;padding-bottom: 0.5rem;"
      document.getElementById("name_emissor").value = name
    }else{
        //Save in firebase if not exist user
        getDniEmissor(dni)
    }

});

}

function getDniReceiverInDatabase(dni){

  document.getElementById("spinnerDNI2").style = "display:block;"
  var name = ""

  db.collection("clients").where("dni", "==",dni).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
         name = doc.data().name
    });

    if(name != ""){
      document.getElementById("spinnerDNI2").style = "display:none;"
      document.getElementById("name2").style = "width: 100%;display: flex;align-items: center;justify-content: space-between;padding-top: 0.5rem;padding-bottom: 0.5rem;"
      document.getElementById("name_receiver").value = name
    }else{
        //Save in firebase if not exist user
        getDniReceiver(dni)
    }

});

}

function getDniEmissor(dni){
  document.getElementById("spinnerDNI").style = "display:block;"
  fetch('https://dniruc.apisperu.com/api/v1/dni/'+dni+'?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNhbWFuLmRhbm55OTVAZ21haWwuY29tIn0.J7apbfAgC6PK_L9EJBkJWMdJmHZZxYWVr2HFEp8WqLQ')
    .then(response => 
          response.json()).then((rs) => {
              if(rs.nombres != undefined){
                document.getElementById("name").style = "width: 100%;display: flex;align-items: center;justify-content: space-between;padding-top: 0.5rem;padding-bottom: 0.5rem;"
                var name = rs.apellidoPaterno+" "+rs.apellidoMaterno+" "+rs.nombres
                document.getElementById("name_emissor").value = name
                document.getElementById("spinnerDNI").style = "display:none;"
              }else{
                alert("error")
                document.getElementById("spinnerDNI").style = "display:none;"
              }
         
          }).catch((error) =>{
              alert(error)
              document.getElementById("spinnerDNI").style = "display:none;"
          });
}


function getDniReceiver(dni){
  document.getElementById("spinnerDNI2").style = "display:block;"
  fetch('https://dniruc.apisperu.com/api/v1/dni/'+dni+'?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNhbWFuLmRhbm55OTVAZ21haWwuY29tIn0.J7apbfAgC6PK_L9EJBkJWMdJmHZZxYWVr2HFEp8WqLQ')
    .then(response => 
          response.json()).then((rs) => {
              if(rs.nombres != undefined){
                document.getElementById("name2").style = "width: 100%;display: flex;align-items: center;justify-content: space-between;padding-top: 0.5rem;padding-bottom: 0.5rem;"
                var name = rs.apellidoPaterno+" "+rs.apellidoMaterno+" "+rs.nombres
                document.getElementById("name_receiver").value = name
                document.getElementById("spinnerDNI2").style = "display:none;"
              }else{
                alert("error")
                document.getElementById("spinnerDNI2").style = "display:none;"
              }
         
          }).catch((error) =>{
              alert(error)
              document.getElementById("spinnerDNI2").style = "display:none;"
          });
}

function setNames(nombres){

  document.getElementById("name").style = "display:flex;width:100%;"
  document.getElementById("name_emissor").value = nombres
  
}

function getTransfers() {
  db.collection("transfers")
  .onSnapshot((snapshot) => {

      transfers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

     
      $("#tdbody").html(
        transfers.map((transfer,i) => {

            $("#spinner").hide();

            var status = ""
            if(transfer.status == "Enviado"){
              status = '<span class="badge badge-dot mr-4">'
              status +='<i class="bg-warning"></i>'
              status +='Enviado'
              status +='</span>'
            }else{
              status = '<span class="badge badge-dot mr-4">'
              status +='<i class="bg-success"></i>'
              status +='Aceptado'
              status +='</span>'
            }
  
            return `<tr>
             
              <td>
              Cod : ${transfer.operation_code}
              </td>
              <td>
              ${"S/"+transfer.amount_to_pay}
              </td>
              <td>
              ${status}
              </td>
              <td>
              ${transfer.place_of_emission}
              </td>
              <td>
              ${transfer.place_of_reception}
              </td>
        <td>
          <button class="btnOption" onclick="details('${encodeURIComponent(JSON.stringify(transfers[i]))}')">
          <ion-icon name="eye-outline"></ion-icon> Ver mas
        </button>
              </td>
              </tr>`;
          })
          .join("")
      );
      //localStorage.setItem("dataTransfers",JSON.stringify(objectTransfers))
    });
}

function getTransfersFromCache() {}

function details(obj){
  MicroModal.show('modal-1')
  obj = JSON.parse(decodeURIComponent(obj))
  console.log(obj.broadcast_user)
  console.log(obj.operation_code)
  document.getElementById("codetransfer").innerHTML = "#"+obj.operation_code
  document.getElementById("emission").innerHTML = obj.place_of_emission
  document.getElementById("emission").style = "font-weight: bold;color:red;"
  document.getElementById("reception").innerHTML = obj.place_of_reception
  document.getElementById("reception").style = "font-weight: bold;color:#049743;"
  document.getElementById("emisor").innerHTML = obj.name_transmitter +" - "+obj.dni_transmitter
  document.getElementById("receptor").innerHTML = obj.name_receiver  +" - "+obj.dni_receiver
  document.getElementById("amount").innerHTML = "S/"+obj.amount_to_pay
}

function registerTransfer(){

  var commission = document.getElementById("comission").value
  var dateOfIssue = Date.now()
  var amountSend = document.getElementById("amount_send").value
  var amountToPay = document.getElementById("amount_to_pay").value
  var broadcastUser = us.name
  var change = parseFloat(amountToPay-amountSend)
  var dniBroadcastUser = us.dni
  var dniReceiver = document.getElementById("dni_receiver").value
  var dniTransmitter = document.getElementById("dni_emissor").value
  var nameReceiver = document.getElementById("name_receiver").value
  var nameTransmitter = document.getElementById("name_emissor").value
  var operationCode = document.getElementById("newTransferID").innerHTML
  var placeOfEmission = us.name_office
  var placeOfReception = nameLocale

  if(nameLocale != "" && commission != "" && amountSend != "" && amountToPay != "" && dniReceiver != "" 
  && dniTransmitter != "" && nameReceiver != "" && nameTransmitter != "" && operationCode != ""){

    var dataObject = {
      name_transmitter : nameTransmitter,
      dni_transmitter : dniTransmitter,
      dni_receiver : dniReceiver,
      name_receiver : nameReceiver,
      place_of_emission : placeOfEmission,
      operation_code : operationCode,
      place_of_reception : placeOfReception,
      date_of_issue : dateOfIssue,
      amount_to_pay : amountToPay,
      amount_send : amountSend,
      commission : commission,
      broadcast_user : broadcastUser,
      change : change,
      dni_broadcast_user : dniBroadcastUser,
      dni_reception_user : "",
      reception_date : 0,
      reception_user : "",
      status : "Enviado",
      id : ""

    }

    db.collection("transfers").add(dataObject).then((result) => {

      document.getElementById("name").style = "display:none;"
      document.getElementById("name2").style = "display:none;"
      document.getElementById("comission").value = ""
      document.getElementById("amount_send").value = ""
      document.getElementById("amount_to_pay").value = ""
      document.getElementById("dni_receiver").value = ""
      document.getElementById("dni_emissor").value = ""
      document.getElementById("name_receiver").value = ""
      document.getElementById("name_emissor").value = ""
      nameLocale = ""
      document.getElementById("pointer").innerHTML = 'Elija un local<i class="fa fa-angle-right"></i>'
  
    })

  }else{
    Swal.fire(
      'Error!',
      'Complete los campos!',
      'warning'
    )
  }

}

function getNumberTransfer(){

  var dataUser = localStorage.getItem("user");
  var us = JSON.parse(dataUser)
  var ctx = 0

  db.collection("transfers")
  .where("place_of_emission", "==", us.name_office)
  .onSnapshot((snapshot) => {
    snapshot.forEach(function() {
      ctx++
    });

    document.getElementById("newTransferID").innerHTML = us.office_code+"-"+(ctx+1)
    ctx = 0

    })
}

function search() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

document.querySelector('.dropdown .title').addEventListener('change',locale);
function locale(e){
  nameLocale = e.target.textContent
}