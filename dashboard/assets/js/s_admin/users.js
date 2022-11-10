$("#bgspinner").hide();
var users = [];
var branchs = [];
var edit_dni_user = "";
var edit_name_user = "";
var edit_branch_user = "";
var edit_id_user = "";
var edit_type_user = "";

var filterText = "";
var filterType = 0;
MicroModal.init();

$("#filters").on("change", function () {
  filterType = $(this).val();
  console.log(parseInt(filterType));
});

$("#topsearch").on("keyup", function () {
  Filter();
});

function Filter() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("topsearch");
  filter = input.value.toUpperCase();
  table = document.getElementById("tbody");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[filterType];
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

$("#tr1").on("click", function () {
  if ($("#tr1icon[name=caret-up-outline]").attr("name") == "caret-up-outline") {
    $("#tr1icon").attr("name", "caret-down-outline");
    $("#tr1icon").text("caret-down-outline");
  } else {
    $("#tr1icon").attr("name", "caret-up-outline");
    $("#tr1icon").text("caret-up-outline");
  }
  $("#tr2icon").attr("name", "caret-up-outline");
  $("#tr2icon").text("caret-up-outline");
  $("#tr3icon").attr("name", "caret-up-outline");
  $("#tr3icon").text("caret-up-outline");
  $("#tr4icon").attr("name", "caret-up-outline");
  $("#tr4icon").text("caret-up-outline");
});
$("#tr2").on("click", function () {
  if ($("#tr2icon[name=caret-up-outline]").attr("name") == "caret-up-outline") {
    $("#tr2icon").attr("name", "caret-down-outline");
    $("#tr2icon").text("caret-down-outline");
  } else {
    $("#tr2icon").attr("name", "caret-up-outline");
    $("#tr2icon").text("caret-up-outline");
  }
  $("#tr1icon").attr("name", "caret-up-outline");
  $("#tr1icon").text("caret-up-outline");
  $("#tr3icon").attr("name", "caret-up-outline");
  $("#tr3icon").text("caret-up-outline");
  $("#tr4icon").attr("name", "caret-up-outline");
  $("#tr4icon").text("caret-up-outline");
});
$("#tr3").on("click", function () {
  if ($("#tr3icon[name=caret-up-outline]").attr("name") == "caret-up-outline") {
    $("#tr3icon").attr("name", "caret-down-outline");
    $("#tr3icon").text("caret-down-outline");
  } else {
    $("#tr3icon").attr("name", "caret-up-outline");
    $("#tr3icon").text("caret-up-outline");
  }
  $("#tr1icon").attr("name", "caret-up-outline");
  $("#tr1icon").text("caret-up-outline");
  $("#tr2icon").attr("name", "caret-up-outline");
  $("#tr2icon").text("caret-up-outline");
  $("#tr4icon").attr("name", "caret-up-outline");
  $("#tr4icon").text("caret-up-outline");
});
$("#tr4").on("click", function () {
  if ($("#tr4icon[name=caret-up-outline]").attr("name") == "caret-up-outline") {
    $("#tr4icon").attr("name", "caret-down-outline");
    $("#tr4icon").text("caret-down-outline");
  } else {
    $("#tr4icon").attr("name", "caret-up-outline");
    $("#tr4icon").text("caret-up-outline");
  }
  $("#tr1icon").attr("name", "caret-up-outline");
  $("#tr1icon").text("caret-up-outline");
  $("#tr2icon").attr("name", "caret-up-outline");
  $("#tr2icon").text("caret-up-outline");
  $("#tr3icon").attr("name", "caret-up-outline");
  $("#tr3icon").text("caret-up-outline");
});

// ------ LISTANDO SUCURSALES ------
db.collection("branchs_list").onSnapshot((snapshot) => {
  branchs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  $("#ebranch").html(
    branchs.map((branch) => {
      return `
        <option value="${branch.name}">${branch.name}</option>
        `;
    })
  );
  $("#nbranch").html(
    branchs.map((branch) => {
      return `
        <option value="${branch.name}">${branch.name}</option>
        `;
    })
  );
});

// ------    LISTANDO USUARIOS ------
db.collection("branch_office").onSnapshot((snapshot) => {
  users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  branchs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  $("#tbody").html(
    users
      .map((user) => {
        var type = "";
        if (user.type == "super_admin") {
          type = `Super Administrador <ion-icon name="construct-outline">`;
        } else if (user.type == "admin") {
          type = `Administrador <ion-icon name="hammer-outline">`;
        } else if (user.type == "operator") {
          type = `Operador <ion-icon name="chatbubbles-outline">`;
        }
        $("#usersSpinner").hide();
        return `
          <tr>
            <td class="dnirow" scope='row' style='padding: 20px'>
              ${user.dni_boss}
            </td>
            <td>
              ${user.local_boss}
            </td>
            <td>
              <div class="div-typeuser"> 
                ${type}
              </div>
	          </td>
            <td>
              ${user.name_office}
            </td>
	          <td>
            <button
            class="btnOption animate__animated animate__bounceIn"
            onclick="setData('${user.dni_boss}', '${user.local_boss}', '${user.name_office}', '${user.id}', '${user.type}')"
            >
	            Editar
	          </button>
            </td>
          </tr>`;
      })
      .join("")
  );
});

function setData(dni, name, branch, id, type) {
  MicroModal.show("modal-1");
  $("#edni").val(dni);
  $("#ename").val(name);
  $("#ebranch").val(branch);
  edit_dni_user = dni;
  edit_name_user = name;
  edit_branch_user = branch;
  edit_id_user = id;
  edit_type_user = type;
}

$("#edit").on("click", function () {
  $("#bgspinner").show();
  var dni = $("#edni").val();
  var name = $("#ename").val();
  var branch = $("#ebranch").val();

  var updateRef = db.collection("branch_office").doc(edit_id_user);
  var newData = {
    dni_boss: dni,
    local_boss: name,
    name_office: branch,
    id: edit_id_user,
  };
  if (
    dni != edit_dni_user ||
    name != edit_name_user ||
    branch != edit_branch_user
  ) {
    if (dni != "" && name != "" && branch != "") {
      updateRef
        .update(newData)
        .then(() => {
          MicroModal.close("modal-1");
          $("#bgspinner").hide();
          Swal.fire(
            "¡Éxito!",
            "Haz editado este usuario correctamente",
            "success"
          );
        })
        .catch((error) => {
          MicroModal.close("modal-1");
          $("#bgspinner").hide();
          alert(error);
        });
    } else {
      MicroModal.close("modal-1");
      $("#bgspinner").hide();
      Swal.fire("¡Error!", "Por favor rellene las casillas", "error");
    }
  } else {
    MicroModal.close("modal-1");
    $("#bgspinner").hide();
    Swal.fire("¡Error!", "No se ha detectado ningún cambio", "error");
  }
});
$("#delete").on("click", function () {
  $("#bgspinner").show();
  var deleteRef = db.collection("branch_office").doc(edit_id_user);
  if (edit_type_user != "super_admin") {
    deleteRef
      .delete()
      .then(() => {
        MicroModal.close("modal-1");
        $("#bgspinner").hide();
        Swal.fire(
          "¡Éxito!",
          "Haz eliminado a este usuario correctamente",
          "success"
        );
      })
      .catch((error) => {
        MicroModal.close("modal-1");
        $("#bgspinner").hide();
        alert(error);
      });
  } else {
    MicroModal.close("modal-1");
    $("#bgspinner").hide();
    Swal.fire(
      "¡Error!",
      "No puedes eliminar a un Super Administrador",
      "error"
    );
  }
});

$("#adduser").on("click", function () {
  MicroModal.show("modal-2");
});

function resetNewData() {
  $("#ndni").val("");
  $("#nname").val("");
  $("#npass").val("");
  $("#nbranch").val("");
  $("#ntype").val("");
}

function verifiedExists(dni) {
  var exists = "false";

  return false;
}

function Added() {
  $("#bgspinner").show();
  var dni = $("#ndni").val();
  var name = $("#nname").val();
  var pass = $("#npass").val();
  var branch = $("#nbranch").val();
  var type = $("#ntype").val();
  var passEnc = btoa(pass);
  var offcode = "";
  var newUser = {
    dni_boss: dni,
    local_boss: name,
    pass: passEnc,
    name_office: branch,
    type: type,
    office_code: offcode,
    options: {
      custom_end: 1900
    },
  };
  if (dni != "" && name != "" && pass != "" && branch != "" && type != "") {
    if (dni.length == 8) {
      var dniResult = "";
      db.collection("branch_office")
        .where("dni_boss", "==", dni)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            dniResult = doc.data().dni_boss;
          });
          if (dniResult == dni) {
            Swal.fire(
              "¡Error!",
              "Este DNI ya se encuentra registrado",
              "error"
            );
            $("#bgspinner").hide();
            MicroModal.close("modal-2");
            return 0;
          } else {
            db.collection("branch_office")
              .add(newUser)
              .then(() => {
                $("#bgspinner").hide();
                MicroModal.close("modal-2");
                Swal.fire(
                  "¡Éxito!",
                  "Haz añadido a este usuario correctamente",
                  "success"
                );
                resetNewData();
              })
              .catch((error) => {
                $("#bgspinner").hide();
                MicroModal.close("modal-2");
                alert(error);
              });
          }
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      $("#bgspinner").hide();
      MicroModal.close("modal-2");
      Swal.fire("¡Error!", "DNI inválido", "error");
    }
  } else {
    $("#bgspinner").hide();
    MicroModal.close("modal-2");
    Swal.fire("¡Error!", "Rellene todas las casillas", "error");
  }
}

function sortTable(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("tableUsers");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < rows.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

// ----------    DNI API ---------    //



$('#ndni').on('input', function () {
  dni = $(this).val();
  console.log(dni)
  console.log(typeof dni)

  var raw = JSON.stringify({
    "dni": dni
  });
  
  var myHeaders = new Headers();

  myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjEzLCJjb3JyZW8iOiJqb3N2YWxpZGtAZ21haWwuY29tIiwiaWF0IjoxNjU4NTg3NDA1fQ.hogcA2JQBiYFZhorjQQxtCvHBX0jvVcNjznsvqSffC8");

  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  if (dni.length == 8) {
    $(this).attr('disabled', 'disabled');
    $('#nname').attr('disabled', 'disabled');
    $('#add').attr('disabled', 'disabled');
    doCORSRequest({
      method: 'GET',
      url: 'https://solarled.com.pe/dni.php?dni=' + dni,
      data: "",
      'Content-Type': 'application/json',
    }, function printResult(result) {
      var data = JSON.parse(result)
      //console.log(data);
      $('#nname').val(`${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`);
      $('#ndni').removeAttr('disabled');
      $('#nname').removeAttr('disabled');
      $('#nedit').removeAttr('disabled');
      $('#add').removeAttr('disabled');
    });
    //getData(requestOptions).then(data => {
    //  console.log(data);
    //  $('#nname').val(`${data.result.nombres} ${data.result.paterno} ${data.result.materno}`);
    //  $(this).removeAttr('disabled');
    //  $('#nname').removeAttr('disabled');
    //  $('#add').removeAttr('disabled');
    //});
  }
})
$('#edni').on('input', function () {
  dni = $(this).val();
  console.log(dni)
  console.log(typeof dni)

  var raw = JSON.stringify({
    "dni": dni
  });

  if (dni.length == 8) {
    $(this).attr('disabled', 'disabled');
    $('#ename').attr('disabled', 'disabled');
    $('#edit').attr('disabled', 'disabled');
    doCORSRequest({
      method: 'GET',
      url: 'https://solarled.com.pe/dni.php?dni=' + dni,
      data: "",
      'Content-Type': 'application/json',
    }, function printResult(result) {
      var data = JSON.parse(result)
      //console.log(data);
      $('#ename').val(`${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`);
      $('#edni').removeAttr('disabled');
      $('#ename').removeAttr('disabled');
      $('#edit').removeAttr('disabled');
    });

      //$('#ename').val(`${data.result.nombres} ${data.result.paterno} ${data.result.materno}`);
      //$(this).removeAttr('disabled');
      //$('#ename').removeAttr('disabled');
      //$('#edit').removeAttr('disabled');
  }
})

var cors_api_url = 'https://cors-anywhere.herokuapp.com/';

function doCORSRequest(options, printResult) {
  var x = new XMLHttpRequest();
  x.open(options.method, cors_api_url + options.url);
  x.onload = x.onerror = function() {
    const result = printResult((x.responseText || ''));
    /*

                    RETORNA EL VALOR EN UN JSON

    */
    return result;
  };
  if (/^POST/i.test(options.method)) {
    x.setRequestHeader('Content-Type', 'application/json');
  }
  x.send(options.data);
}

// Bind event
//(function() {
//  var urlField = document.getElementById('url');
//  var dataField = document.getElementById('data');
//  var outputField = document.getElementById('output');
//  document.getElementById('get').onclick =
//  document.getElementById('post').onclick = function(e) {
//    e.preventDefault();
//    doCORSRequest({
//      method: 'GET',
//      url: 'https://solarled.com.pe/dni.php?dni=76133536',
//      data: "",
//      'Content-Type': 'application/json',
//    }, function printResult(result) {
//      return result;
//    });
//  };
//})();
//if (typeof console === 'object') {
//  console.log('// To test a local CORS Anywhere server, set cors_api_url. For example:');
//  console.log('cors_api_url = "http://localhost:8080/"');
//}

//async function getData(request) {
//  var data = {}
//  const response = await fetch('https://www.softwarelion.xyz/api/reniec/reniec-dni', request).//then(response => data = response.json())
//  return data;
//}