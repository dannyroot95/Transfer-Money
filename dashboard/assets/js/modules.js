verifyDataLocale()

var firebaseConfig = {
  apiKey: "AIzaSyDWJ2-qaRK94IR98HGgbuQkO8AgPHFFyB8",
  authDomain: "atm-transfers.firebaseapp.com",
  projectId: "atm-transfers",
  storageBucket: "atm-transfers.appspot.com",
  messagingSenderId: "307303267152",
  appId: "1:307303267152:web:c091d3d494bcea2b094a55",
};

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
var base64String = "";

if (user.type == "super_admin") {
  console.log("super admin");
  $("#modules").html(
    `
    <li>
          <a href="#">
            <span class="icon">

              <img src="assets/imgs/amt.png" width="40px" height="40px" style="margin-top: 12px;" />
            </span>
            <span class="title2"><strong>ATM - Transferencias</strong>
              <p id="typeUser"></p>
            </span>
          </a>
        </li>

        <li>
          <a href="#dashboard" class="links_modulo">
            <span class="icon">
              <ion-icon name="home-outline"></ion-icon>
            </span>
            <span class="title">Inicio</span>
          </a>
        </li>
  

        <li>
          <a href="#users">
            <span class="icon">
              <ion-icon name="people-outline"></ion-icon>
            </span>
            <span class="title">Usuarios</span>
          </a>
        </li>
  
        <li>
          <a href="#branchs">
            <span class="icon">
              <ion-icon name="business-outline"></ion-icon>
            </span>
            <span class="title">Sucursales</span>
          </a>
        </li>

        <li>
          <a href="#transfers">
            <span class="icon">
              <ion-icon name="cash-outline"></ion-icon>
            </span>
            <span class="title">Transferencia</span>
          </a>
        </li>
     

        <li>
          <a href="#checkout">
            <span class="icon">
              <ion-icon name="file-tray-stacked-outline"></ion-icon>
            </span>
            <span class="title">Caja</span>
          </a>
        </li>
     

        <li>
          <a href="#reports">
            <span class="icon">
              <ion-icon name="bar-chart-outline"></ion-icon>
            </span>
            <span class="title">Reportes</span>
          </a>
        </li>

        <script>;
        window.open("#dashboard", "_self");
        </script>

        <li>
          <a href="#" onclick="logout()">
            <span class="icon">
              <ion-icon name="log-out-outline"></ion-icon>
            </span>
            <span class="title">Cerrar sesión</span>
          </a>
        </li>
    `
  );
} else if (user.type == "admin") {
  console.log("admin");
  $("#modules").html(
    `
    <li>
          <a href="#">
            <span class="icon">

              <img src="assets/imgs/amt.png" width="40px" height="40px" style="margin-top: 12px;" />
            </span>
            <span class="title2"><strong>ATM - Transferencias</strong>
              <p id="typeUser"></p>
            </span>
          </a>
        </li>

        <li>
          <a href="#dashboard" class="links_modulo">
            <span class="icon">
              <ion-icon name="home-outline"></ion-icon>
            </span>
            <span class="title">Inicio</span>
          </a>
        </li>
        <script>;
          window.open("#dashboard", "_self");
        </script>

        <li>
          <a href="#transfers">
            <span class="icon">
              <ion-icon name="cash-outline"></ion-icon>
            </span>
            <span class="title">Transferencia</span>
          </a>
        </li>
        <script>;
          window.open("#transfers", "_self");
        </script>

        <li>
          <a href="#">
            <span class="icon">
              <ion-icon name="file-tray-stacked-outline"></ion-icon>
            </span>
            <span class="title">Caja</span>
          </a>
        </li>

        <li>
          <a href="#">
            <span class="icon">
              <ion-icon name="bar-chart-outline"></ion-icon>
            </span>
            <span class="title">Reportes</span>
          </a>
        </li>

        <li>
          <a href="#" onclick="logout()">
            <span class="icon">
              <ion-icon name="log-out-outline"></ion-icon>
            </span>
            <span class="title">Cerrar sesión</span>
          </a>
        </li>
    `
  );
} else if (user.type == "operator") {
  console.log("operadpr");
}

function urlModulo(url) {
  return (
    "<iframe src='" +
    url +
    "' style='width: 100%; height: 100%; border: none;'></iframe>"
  );
}

function listaModulos_A(modulo, contenedor) {
  if ("#dashboard" == modulo) {
    contenedor.innerHTML = urlModulo("assets/modules/admin/dashboard.html");
    document.getElementById("start").innerText = "Inicio";
  } else if ("#transfers" == modulo) {
    contenedor.innerHTML = urlModulo("assets/modules/admin/transfers.html");
    document.getElementById("start").innerText = "Transferencias";
  } else if ("#" == modulo) {
    contenedor.innerHTML = "<br>&nbsp;&nbsp;Muy Pronto...";
  } else {
    contenedor.innerHTML = urlModulo("assets/modules/dashboard.html");
  }
}

function listaModulos_SA(modulo, contenedor) {
  if ("#dashboard" == modulo) {
    contenedor.innerHTML = urlModulo("assets/modules/dashboard.html");
    document.getElementById("start").innerText = "Inicio";
  } else if ("#users" == modulo) {
    contenedor.innerHTML = urlModulo("assets/modules/users.html");
    document.getElementById("start").innerText = "Usuarios";
  } else if ("#transfers" == modulo) {
    contenedor.innerHTML = urlModulo("assets/modules/transfers.html");
    document.getElementById("start").innerText = "Transferencias";
  } else if ("#branchs" == modulo) {
    contenedor.innerHTML = urlModulo("assets/modules/branchs.html");
    document.getElementById("start").innerText = "Sucursales";
  } else if ("#checkout" == modulo) {
    contenedor.innerHTML = urlModulo("assets/modules/checkout.html");
    document.getElementById("start").innerText = "Caja";
  } else if ("#reports" == modulo) {
    contenedor.innerHTML = urlModulo("assets/modules/reports.html");
    document.getElementById("start").innerText = "Reportes";
  } else if ("#" == modulo) {
    contenedor.innerHTML = "<br>&nbsp;&nbsp;Muy Pronto...";
  } else {
    contenedor.innerHTML = urlModulo("assets/modules/dashboard.html");
  }
}

var contentModulo = document.querySelector(".body-content");
let linkModulo = document.querySelector(".nav-list").querySelectorAll("a");
if(user.type == "super_admin"){
  listaModulos_SA(window.location.hash, contentModulo);
}else if(user.type == "admin"){
  listaModulos_A(window.location.hash, contentModulo);
}

linkModulo.forEach((elemento) => {
  elemento.addEventListener("click", function () {
    if(user.type == "super_admin"){
      listaModulos_SA(elemento.getAttribute("href") + "", contentModulo);
    }else if(user.type == "admin"){
      listaModulos_A(elemento.getAttribute("href") + "", contentModulo);
    }
  });
});


function saveProfileData(){

  var name_local = document.getElementById("name_local").value
  var ruc = document.getElementById("ruc").value
  var address = document.getElementById("address").value
  var phone_profile = document.getElementById("phone_profile").value

  if(base64String != ""){
    base64String = "data:image/png;base64,"+base64String
  }

  if(name_local != "" && ruc != "" && address != "" && phone_profile != ""){

    var data_obj = {
      name_local:name_local,ruc:ruc,address:address,phone_profile:phone_profile,image:base64String
    }

    db.collection("locale_data").doc(user.id).set(data_obj).then((result) => {
      localStorage.setItem("localeData", JSON.stringify(data_obj));
      Swal.fire(
        "¡Éxito!",
        "Se configuró correctamente",
        "success"
      )
      MicroModal.close('modal-profile')
    }).catch(error =>{
      Swal.fire(
        "Error!",
        "No se guardaron los datos",
        "error"
      )
    })
  }else{
    Swal.fire(
      "Oops!",
      "Complete los campos",
      "warning"
    )
  } 

}

function Uploaded() {
	var file = document.querySelector(
		'input[type=file]')['files'][0];
	var reader = new FileReader();
	reader.onload = function () {
		base64String = reader.result.replace("data:", "")
			.replace(/^.+,/, "");
		imageBase64Stringsep = base64String;
	}
	reader.readAsDataURL(file);
  const objectURL = URL.createObjectURL(file);
   document.getElementById("myLogo").src = objectURL
   document.getElementById("no-logo").innerHTML = '<label style="font-size: 12px;margin-left:12px;">Mi logo</label>'
}

function display() {
	console.log("Base64String about to be printed");
	alert(base64String);
}

function verifyDataLocale(){

  var data = localStorage.getItem("localeData")
  var json = JSON.parse(data)

  if(json != null && json != ""){
    document.getElementById("name_local").value = json.name_local
    document.getElementById("ruc").value = json.ruc
    document.getElementById("address").value = json.address
    document.getElementById("phone_profile").value = json.phone_profile

    if(json.image != ""){
      document.getElementById("myLogo").src = json.image
      document.getElementById("no-logo").innerHTML = '<label style="font-size: 12px;margin-left:12px;">Mi logo</label>'
    }

  }

}