var checkouts_users = [];
var alltransfers = [];
var transfers = [];
var allcash = [];
var todaycash = [];
var checkoutsRef = db.collection("branch_office");
var transfersRef = db.collection("transfers");
const user = JSON.parse(localStorage.getItem("user"));
var req_dni = "";
MicroModal.init();

const yesterday = () => {
  const timeStamp = new Date().getTime();
  const yesterdayTimeStamp = timeStamp - 24 * 60 * 60 * 1000;
  return yesterdayTimeStamp / 1000;
};

console.log(onlyDate(yesterday()));

const modals = document.querySelectorAll(".js-modal-slide");
// select all modals on the page

modals.forEach((element) => {
  // iterate over all modals

  if (element.classList.contains("is-open")) {
    // find currently active

    element.querySelector(".js-modal-close-button").click();
    // trigger click on close button
  }
});

const [todaydate, todaytime] = formatDate(new Date()).split(" ");

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}
function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-") +
    " " +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      // padTo2Digits(date.getSeconds()),  // 👈️ can also add seconds
    ].join(":")
  );
}

var filterText = "";
var filterType = 0;

$("#dateCalendar").val(todaydate);

var dateFilter = onlyDate(new Date() / 1000);
console.log(dateFilter);

checkoutsRef.onSnapshot((snapshot) => {
  checkouts_users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(checkouts_users);
  $("#usersSpinner").hide();
  $("#cards").html(
    checkouts_users.map((user) => {
      var childs = alltransfers
        .filter((filter) => {
          if (filter.dni_broadcast_user == user.dni_boss) {
            return true;
          }
        })
        .filter((filter) => {
          var tempdata = "";
          if (filter.status == "Enviado") {
            tempdata = onlyDate(filter.date_of_issue);
          } else if (filter.status == "Aceptado") {
            tempdata = onlyDate(filter.reception_date);
          }
          if (tempdata === dateFilter) {
            return true;
          }
        }).length;
      console.log(childs);
      var childhtml = ``;
      if (childs < 1) {
        childhtml = ``;
      } else if (childs > 1 && childs < 3) {
        childhtml = `
          <div class="child"></div>
        `;
      } else if (childs > 2 && childs < 4) {
        childhtml = `
          <div class="child"></div>
          <div class="child"></div>
        `;
      } else if (childs > 3 && childs < 5) {
        childhtml = `
          <div class="child"></div>
          <div class="child"></div>
          <div class="child"></div>
        `;
      } else if (childs > 4 && childs < 6) {
        childhtml = `
          <div class="child"></div>
          <div class="child"></div>
          <div class="child"></div>
          <div class="child"></div>
        `;
      }
      return `
      <div class="usercard" onclick="saveData('${user.dni_boss}')">
        <div class="child" style="text-align: center;">
          <h2><strong>${user.dni_boss}</strong></h2>
          <h3 style="padding-bottom: 10px;">${user.local_boss}</h3>
          <strong>${user.name_office}</strong>
        </div>
        ${childhtml}
      </div>
      `;
    })
  );
});

db.collection("petty_cash").onSnapshot((snapshot) => {
  actualMinutes = onlyMinutes(new Date() / 1000);
  console.log(actualMinutes);
  cashOptions = checkouts_users.filter((n) => {
    if (n.dni_boss == user.dni) {
      return true;
    }
  });
  cashOptions = cashOptions[0].options;
  console.log(cashOptions);
  endtime = cashOptions.custom_end;
  console.log(endtime);
  allcash = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  todaycash = allcash.filter((cash) => {
    //if (dateFilter == onlyDate(cash.date_start)) {
    //  if (cash.status == "open") {
    //    if (cash.dni == user.dni) {
    //      return true;
    //    }
    //  }
    //}
    if (cash.status == "open") {
      if (cash.dni == user.dni) {
        return true;
      }
    }
  });
  console.log(todaycash);
  //
  //    NOTIFICACION
  //
  //const Toast = Swal.mixin({
  //  toast: true,
  //  position: "top",
  //  showConfirmButton: false,
  //  timer: 2000,
  //  timerProgressBar: true,
  //  didOpen: (toast) => {
  //    //toast.addEventListener('mouseenter', Swal.stopTimer)
  //    toast.addEventListener("mouseleave", Swal.resumeTimer);
  //  },
  //});
  //
  //Toast.fire({
  //  icon: "info",
  //  title: "Caja chica actualizada con nuevos datos",
  //});
  htmloptionscash = `
    <button class="btnOptionConfig" id="cashconfig">Configuración</button>
    <button class="btnOptionDeny" id="cashclose" style="display: none;">Cerrar caja</button>
  `;
  $("#div-optionscash").html(htmloptionscash);
  var now = new Date().getTime() / 1000;
  var yester = (new Date().getTime() - 24 * 60 * 60 * 1000) / 1000;
  console.log(yester);
  console.log(now);
  var yestercash = allcash.filter((n) => {
    if (onlyDate(n.date_start) == onlyDate(yester)) {
      if (n.status == "open") {
        return true;
      }
    }
  });
  console.log(yestercash);
  if (
    yestercash != "" &&
    yestercash != null &&
    yestercash != undefined &&
    yestercash != {}
  ) {
    $("#cashclose").show();
  } else if (actualMinutes >= endtime) {
    $("#cashclose").show();
  }

  htmltodaycash = ``;
  const FetchData = () => {
    actualMinutes = onlyMinutes(new Date().getTime() / 1000);
    console.log(actualMinutes);
    if (actualMinutes >= endtime) {
      $("#cashclose").show();
    }
  };
  setInterval(FetchData, 60000);

  if (todaycash.length == 1) {
    $("#div-newcash").html(`<div>Tiene una caja abierta</div>`);
    $("#div-viewcash").html(
      `<button class="btnOption animate__animated animate__heartBeat" id="viewCash">Ver caja</button>`
    );
    htmltodaycash = `
    <div>
      <div style="display: flex; justify-content: space-between; margin: 0 10px;">
        <h2 style="color: #545454;">Monto: </h2>
        <p class="better-text noselect">${todaycash[0].mont} S/.</p>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 0 10px;">
        <h2 style="color: #545454;">Fecha de registro: </h2>
        <p class="better-text noselect">${onlyDatetime(
          todaycash[0].date_start
        )}</p>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 0 10px;">
        <h2 style="color: #545454;">DNI: </h2>
        <p class="better-text noselect">${todaycash[0].dni}</p>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 0 10px;">
        <h2 style="color: #545454;">Creado por: </h2>
        <p class="better-text noselect" style="font-size: 15px;">${
          todaycash[0].created_by
        }</p>
      </div>
    </div>
    `;
  } else if (todaycash.length == 0) {
    $("#div-newcash").html(
      `<button class="btnOption animate__animated animate__heartBeat" id="openCash">Abrir caja</button>`
    );
    $("#div-viewcash").html(`No tiene una caja abierta para hoy`);
  }
  htmlviewoptions = `
  <div>
      <div style="display: flex; justify-content: space-between; margin: 0 10px;">
        <h2 style="color: #545454;">Horario de cierre: </h2>
        <p class="better-text noselect">${numberToTime(cashOptions)} hrs.</p>
      </div>
    </div>
  `;
  initCash(todaycash, htmltodaycash, cashOptions, htmlviewoptions);
});

var dateSelect = "";
$("#filters").on("change", function () {
  filterType = $(this).val();
  console.log(parseInt(filterType));
});

$("#dateCalendar").on("change", function () {
  pre_date = $(this).val();
  dateFilter = onlyCalendarDate(new Date(pre_date).getTime() / 1000);
  console.log(dateFilter);
  console.log();
  viewCheckouts(req_dni, dateFilter);
});

function onlyCalendarDate(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate() + 1;

  if (date <= 9) {
    date = "0" + date;
  }

  var time = date + " " + month + " " + year;
  return time;
}

$("#topsearch2").on("keyup", function () {
  Filter();
});

function Filter() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("topsearch2");
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
  $("#tr5icon").attr("name", "caret-up-outline");
  $("#tr5icon").text("caret-up-outline");
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
  $("#tr5icon").attr("name", "caret-up-outline");
  $("#tr5icon").text("caret-up-outline");
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
  $("#tr5icon").attr("name", "caret-up-outline");
  $("#tr5icon").text("caret-up-outline");
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
  $("#tr5icon").attr("name", "caret-up-outline");
  $("#tr5icon").text("caret-up-outline");
});
$("#tr5").on("click", function () {
  if ($("#tr5icon[name=caret-up-outline]").attr("name") == "caret-up-outline") {
    $("#tr5icon").attr("name", "caret-down-outline");
    $("#tr5icon").text("caret-down-outline");
  } else {
    $("#tr5icon").attr("name", "caret-up-outline");
    $("#tr5icon").text("caret-up-outline");
  }
  $("#tr1icon").attr("name", "caret-up-outline");
  $("#tr1icon").text("caret-up-outline");
  $("#tr2icon").attr("name", "caret-up-outline");
  $("#tr2icon").text("caret-up-outline");
  $("#tr3icon").attr("name", "caret-up-outline");
  $("#tr3icon").text("caret-up-outline");
  $("#tr4icon").attr("name", "caret-up-outline");
  $("#tr4icon").text("caret-up-outline");
});

transfersRef.onSnapshot((snapshot) => {
  alltransfers = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
});

function saveData(dni) {
  req_dni = dni;
  viewCheckouts(req_dni, dateFilter);
}

function viewCheckouts(dni, dateFilter) {
  console.log(dni);
  MicroModal.show("modal-1");
  var usercheckouts = alltransfers
    .filter((pre) => {
      $("#transfersSpinner").hide();
      if (pre.dni_broadcast_user == dni) {
        return true;
      }
    })
    .filter((filter) => {
      var tempdata = "";
      if (filter.status == "Enviado") {
        tempdata = onlyDate(filter.date_of_issue);
      } else if (filter.status == "Aceptado") {
        tempdata = onlyDate(filter.reception_date);
      }
      if (tempdata === dateFilter) {
        return true;
      }
    });
  console.log(usercheckouts.length);
  if (usercheckouts.length != 0) {
    $("#tbody").html(
      usercheckouts.map((transfer, i) => {
        var status = "";
        if (transfer.status == "Enviado") {
          status = '<span class="badge badge-dot mr-4">';
          status += '<i class="bg-warning"></i>';
          status += "Enviado";
          status += "</span>";
        } else {
          status = '<span class="badge badge-dot mr-4">';
          status += '<i class="bg-success"></i>';
          status += "Aceptado";
          status += "</span>";
        }

        return `
                  <tr>
                    <td class="dnirow" scope='row' style='padding: 20px'>
                      ${"Cod : " + transfer.operation_code}
                    </td>
                    <td>
                      ${"S/" + transfer.amount_to_pay}
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
                      <button class="btnOption" onclick="details('${encodeURIComponent(
                        JSON.stringify(transfer)
                      )}')">
                        <ion-icon name="eye-outline"></ion-icon> Ver mas
                      </button>
                    </td>
                  </tr>`;
      })
    );
  } else {
    $("#tbody").html(
      `<tr>
        <td class="dnirow" scope='row' style='padding: 20px'>
          No tiene ninguna transferencia de la fecha ${dateFilter}
        </td>
      </tr>`
    );
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

function details(obj) {
  MicroModal.show("modal-2");
  obj = JSON.parse(decodeURIComponent(obj));
  console.log(obj);
  if (obj.status == "Enviado") {
    dateSelect = obj.date_of_issue;
  } else if (obj.status == "Aceptado") {
    dateSelect = obj.reception_date;
  }
  console.log(onlyDate(dateSelect));
  console.log(obj.broadcast_user);
  console.log(obj.operation_code);
  document.getElementById("codetransfer").innerHTML = "#" + obj.operation_code;
  document.getElementById("emission").innerHTML = obj.place_of_emission;
  document.getElementById("emission").style = "font-weight: bold;color:red;";
  document.getElementById("reception").innerHTML = obj.place_of_reception;
  document.getElementById("reception").style =
    "font-weight: bold;color:#049743;";
  document.getElementById("emisor").innerHTML =
    obj.name_transmitter + " - " + obj.dni_transmitter;
  document.getElementById("receptor").innerHTML =
    obj.name_receiver + " - " + obj.dni_receiver;
  document.getElementById("amount").innerHTML = "S/" + obj.amount_to_pay;
}

function onlyDate(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();

  if (date <= 9) {
    date = "0" + date;
  }

  var time = date + " " + month + " " + year;
  return time;
}

function onlyDatetime(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var minute = a.getMinutes();

  if (date <= 9) {
    date = "0" + date;
  }
  if (hour <= 9) {
    hour = "0" + hour;
  }
  if (minute <= 9) {
    minute = "0" + minute;
  }

  var time = date + " " + month + " " + year + " - " + hour + ":" + minute;
  return time;
}
function onlyMinutes(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);

  var hour = a.getHours();
  var minute = a.getMinutes();

  if (hour <= 9) {
    hour = "0" + hour;
  }
  if (minute <= 9) {
    minute = "0" + minute;
  }

  var time = `${hour}${minute}`;
  return parseInt(time);
}

$("#closeModal1").on("click", function () {
  MicroModal.close("modal-1");
});

//var petty_cash = {
//  mont: 500,
//  date_start: 1658844237,
//  date_end: 1658887437,
//  dni: 76133536,
//  created_by: "JOSÉ VALENTINO",
//};
//if(Object.keys(petty_cash).length !== 0){
//  $('#openCash').prop('disabled', true);
//  $('#openCash').html('Caja de hoy creada')
//}
//petty_cash = {};
function initCash(datacash, htmlview, optionscash, htmlviewoptions) {
  $("#cashconfig").on("click", function () {
    Swal.fire({
      title: "Tu configuracion actual",
      html: htmlviewoptions,
      showCancelButton: true,
      confirmButtonText: "Modificar configuracion",
      showLoaderOnConfirm: true,
    }).then((result) => {
      num = optionscash.custom_end;
      digits = num.toString().split("");
      realDigits = digits.map(Number);
      console.log(realDigits);
      newValue =
        realDigits[0].toString() +
        realDigits[1].toString() +
        ":" +
        realDigits[2].toString() +
        realDigits[3].toString();
      console.log(newValue);
      if (result.isConfirmed) {
        Swal.fire({
          title: "Nueva configuracion",
          html: `
          <label for="">Horario de cierre</label>
          <input type="time" id="newtime" class="swal-input" value="${newValue}"/>
          `,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: "Ok",
          showLoaderOnConfirm: true,
          focusConfirm: false,
          preConfirm: async () => {
            var dbnewtime = timeToNumber(
              document.getElementById("newtime").value
            );

            var currID = checkouts_users.filter((n) => {
              if (n.dni_boss == user.dni) {
                return true;
              }
            });
            console.log(currID);
            currID = currID[0].id;
            await db
              .collection("branch_office")
              .doc(currID)
              .update({
                options: {
                  custom_end: dbnewtime,
                },
              })
              .then(() => {
                return true;
              })
              .catch((error) => {
                Swal.fire(
                  "Error",
                  "Ocurrió un error al añadir la nueva configuracion",
                  "error"
                );
              });
          },
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire(
              "Éxito",
              "Cambiaste la nueva configuración con éxito",
              "success"
            );
            window.location.reload();
          }
        });
      }
    });
  });
  $("#cashclose").on("click", function () {
    Swal.fire({
      title: "Confirmación",
      html: "¿Estas seguro de cerrar esta caja?",
      showCancelButton: true,
      confirmButtonText: "Sí estoy seguro",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        await db
          .collection("petty_cash")
          .doc(todaycash[0].id)
          .update({
            status: "closed",
            date_end: new Date().getTime()/1000,
          })
          .then((result) => {
            return result;
          })
          .catch((err) => {
            Swal.fire("Error", "Error al cerrar la caja", "error");
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Caja cerrada",
          html: "Cerró esta caja con éxito",
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "Ok",
        });
      }
    });
  });
  $("#viewCash").on("click", function () {
    Swal.fire({
      title: "<strong>Mi caja chica</strong>",
      html: htmlview,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: '<i class="fa fa-thumbs-down">Volver</i>',
    });
  });
  $("#openCash").on("click", async function () {
    var today = onlyDate(new Date().getTime() / 1000).toString;
    console.log(today);
    var existscash = false;
    const { value: formValues } = await Swal.fire({
      title: "Nueva caja",
      confirmButtonText: "Abrir",
      showLoaderOnConfirm: true,
      html: `<input id="mont" class="swal-input" type="number" placeholder="Monto"></input>
        <input id="dni" class="swal-input" type="number" placeholder="DNI" value="${user.dni}"></input>
        <input id="created_by" class="swal-input" type="string" placeholder="Creado por" value="${user.name}"></input>`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("mont").value,
          document.getElementById("dni").value,
          document.getElementById("created_by").value,
        ];
      },
    });

    if (formValues) {
      //Swal.fire(JSON.stringify(formValues));
      console.log(formValues);
      var correct = true;
      formValues.forEach((data) => {
        if (data == "" || data == undefined || data == null) {
          correct = false;
        }
      });
      if (correct != false) {
        var petty_cash_data = {
          created_by: formValues[2],
          date_start: new Date().getTime() / 1000,
          date_end: "",
          dni: formValues[1],
          mont: formValues[0],
          status: "open",
        };
        Swal.fire({
          title: "Confirmación",
          html: "¿Estas seguro de abrir una nueva caja?",
          showCancelButton: true,
          confirmButtonText: "Sí estoy seguro",
          showLoaderOnConfirm: true,
          preConfirm: () => {
            return db
              .collection("petty_cash")
              .add(petty_cash_data)
              .then((docRef) => {
                return docRef.id;
              })
              .catch((err) => {
                Swal.fire("Error", "Error al añadir la caja", "error");
              });
          },
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Caja abierta",
              html: "Abrió con éxito una nueva caja",
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonText: "Ok",
            });
          }
        });
      } else {
        Swal.fire("Error", "Complete todos los campos", "error");
      }
    }
  });
}
function timeToNumber(data) {
  var a = data.split(":");
  console.log(a);
  return parseInt(`${a[0]}${a[1]}`);
}

const numberToTime = (n) => {
  var num = n.custom_end;
  var digits = num.toString().split("");
  var realDigits = digits.map(Number);
  var result = `${realDigits[0]}${realDigits[1]}:${realDigits[2]}${realDigits[3]}`;
  return result;
};
