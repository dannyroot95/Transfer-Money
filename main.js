// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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



$(function () {
  // PRESIONANDO ENTER O DANDOLE AL BOTÓN DE "INGRESAR"

  $("#login-form").on("submit", function (event) {
    event.preventDefault();
    var data = $("#login-form").serializeArray();
    // console.log(data);
    dni = "";
    pass = "";
    dniV = false;
    passV = false;
    data.map(function (item) {
      if (item.name == "DNI") {
        if (item.value != "") {
          dniV = true;
          dni = item.value;
        }
      }
      if (item.name == "CONTRASENA") {
        if (item.value != "") {
          passV = true;
          pass = item.value;
        }
      }
    });
    if (dniV == true) {
      if (dni.length == 8) {
        if (passV == true) {
          console.log("Datos correctos!");
          console.log(`DNI: ${dni}`);
          console.log(`Contraseña: ${pass}`);
          fireLogin(dni, pass);
        } else {
          Swal.fire("¡Error!", "Introduzca su contraseña", "error");
        }
      } else {
        Swal.fire("¡Error!", "Introduzca correctamente su DNI", "error");
      }
    } else {
      Swal.fire("¡Error!", "Introduzca su DNI", "error");
    }
  });
});

$("#DNI").on("keyup", function () {
  limitText(this, 8);
});

function limitText(field, maxChar) {
  var ref = $(field),
    val = ref.val();
  if (val.length >= maxChar) {
    ref.val(function () {
      return val.substr(0, maxChar);
    });
  }
}

// function checkpassword(password) {
//   var strength = 0;
//   if (password.match(/[a-z]+/)) {
//     strength += 1;
//   }
//   if (password.match(/[A-Z]+/)) {
//     strength += 1;
//   }
//   if (password.match(/[0-9]+/)) {
//     strength += 1;
//   }
//   if (password.match(/[$@#&!]+/)) {
//     strength += 1;
//   }
//   return strength;
// }
//

function fireLogin(dni, pass) {
  $("#spinner").css("display", "flex");
  const loginRef = db.collection("branch_office").where("dni_boss", "==", dni);
  loginRef
    .get()
    .then((docSnapshot) => {
      var exists = false;
      docSnapshot.forEach((doc) => {
        console.log(doc.data());
        if (doc.data().dni_boss == dni) {
          exists = true;
          let passEnc = btoa(pass);
          if (doc.data().pass == passEnc) {
            console.log(doc.data());
            $("#spinner").css("display", "none");
            console.log(doc.data());
            var dataLogin = {
              id:doc.id,
              name: doc.data().local_boss,
              dni: dni,
              office_code : doc.data().office_code,
              name_office : doc.data().name_office,
              type: doc.data().type,
            };
            localStorage.setItem("user", JSON.stringify(dataLogin));
            window.location.href = "./dashboard";
          } else {
            $("#spinner").css("display", "none");
            Swal.fire(
              "¡Error!",
              "La contraseña ingresada no es la correcta",
              "error"
            );
          }
        }
      });
      if (exists == false) {
        $("#spinner").css("display", "none");
        Swal.fire("¡Error!", "Este DNI no se encuentra registrado", "error");
      }
    })
    .catch((error) => {
      $("#spinner").css("display", "none");
      console.log(error);
    });
}
