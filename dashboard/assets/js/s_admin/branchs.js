$("#bgspinner").hide();
var users = [];
var branchs = [];
var edit_name_branch = "";
var edit_code_branch = "";
var edit_id_branch = "";

var max_number = 0;

var filterText = "";
var filterType = 0;
MicroModal.init({
  onShow: modal => console.info(`${modal.id} is shown`),
});

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

// ------    LISTANDO SUCURSALES ------
db.collection("branchs_list").onSnapshot((snapshot) => {
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
      .map((branch) => {
        $("#usersSpinner").hide();
        if (branch.code > max_number) {
          max_number = parseInt(branch.code);
        }
        return `
          <tr>
            <td>
              ${branch.name}
            </td>
	          <td>
            <button
            class="btnOption animate__animated animate__bounceIn"
            onclick="setData('${branch.name}', '${branch.code}', '${branch.id}')"
            >
	            Editar
	          </button>
            </td>
          </tr>`;
      })
      .join("")
  );
});

function setData(name, code, id) {
  MicroModal.show("modal-1");
  $("#ename").val(name);
  edit_name_branch = name;
  edit_code_branch = code;
  edit_id_branch = id;
}

$("#edit").on("click", function () {
  $("#bgspinner").show();
  var name = $("#ename").val();

  var updateRef = db.collection("branchs_list").doc(edit_id_branch);
  var newData = {
    name: name,
    id: edit_id_branch,
  };
  if (name != edit_name_branch) {
    if (name != "") {
      db.collection("branchs_list")
        .where("name", "==", name)
        .get()
        .then((querySnapshot) => {
          var nameResult = "";
          querySnapshot.forEach((doc) => {
            nameResult = doc.data().name;
          });
          if (nameResult == name) {
            Swal.fire(
              "¡Error!",
              "Una sucursal ya lleva ese nombre",
              "error"
            );
            $("#bgspinner").hide();
            MicroModal.close("modal-1");
            return 0;
          } else {
            updateRef
              .update(newData)
              .then(() => {
                MicroModal.close("modal-1");
                $("#bgspinner").hide();
                Swal.fire(
                  "¡Éxito!",
                  "Haz editado esta sucursal correctamente",
                  "success"
                );
              })
              .catch((error) => {
                MicroModal.close("modal-1");
                $("#bgspinner").hide();
                alert(error);
              });
          }
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
  var deleteRef = db.collection("branchs_list").doc(edit_id_branch);
  deleteRef
    .delete()
    .then(() => {
      MicroModal.close("modal-1");
      $("#bgspinner").hide();
      Swal.fire(
        "¡Éxito!",
        "Haz eliminado esta sucursal correctamente",
        "success"
      );
      max_number -= 1;
    })
    .catch((error) => {
      MicroModal.close("modal-1");
      $("#bgspinner").hide();
      alert(error);
    });
});

$("#adduser").on("click", function () {
  MicroModal.show("modal-2");
});

function resetNewData() {
  $("#nname").val("");
}

function Added() {
  $("#bgspinner").show();
  var name = $("#nname").val();
  var newBranch = {
    name: name,
    code: max_number + 1,
  };
  if (name != "") {
    var nameResult = "";
    db.collection("branchs_list")
      .where("name", "==", name)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          nameResult = doc.data().name;
        });
        if (nameResult == name) {
          Swal.fire(
            "¡Error!",
            "Esta sucursal ya se encuentra registrado",
            "error"
          );
          $("#bgspinner").hide();
          MicroModal.close("modal-2");
          return 0;
        } else {
          db.collection("branchs_list")
            .add(newBranch)
            .then(() => {
              $("#bgspinner").hide();
              MicroModal.close("modal-2");
              Swal.fire(
                "¡Éxito!",
                "Haz añadido esta sucursal correctamente",
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
    Swal.fire("¡Error!", "Rellene la casilla", "error");
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
