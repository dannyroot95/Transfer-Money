const user = JSON.parse(localStorage.getItem("user"));
var letteruser = "";

if (localStorage.getItem("user") !== null) {
  if (user != null && user != "" && user != undefined) {
    let nameuser = user.name;
    var typeuser = "";
    if (user.type == "super_admin") {
      typeuser = "Super Administrador";
    } else if (user.type == "admin") {
      typeuser = "Administrador";
    } else if (user.type == "operator") {
      typeuser = "Operador";
    }
    letteruser = Array.from(nameuser)[0];
    console.log(letteruser);
    $("#textuser").text(letteruser);
    $("#typeUser").text(typeuser);
  } else {
    window.location.href = "../../index.html";
  }
} else {
  window.location.href = "../../index.html";
}

function logout() {
  localStorage.removeItem("user");
  window.location.reload();
}

// add hovered class to selected list item
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};
