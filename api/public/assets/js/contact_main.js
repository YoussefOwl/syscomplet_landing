/* ------------------------ Déclaration des variables ----------------------- */
const prod_mode = true;
const API_URLS = {
  API_BASE_URL: prod_mode
    ? "https://api.optiques.ma/api/"
    : "http://localhost:8000/api/"
};
/* -------------------- Les founction à executer au début ------------------- */
$(document).ready(function () {
  localStorage.setItem("current_lang", "fr");
  GetContenus();
  AfficherContactsSubjects();
  $("#contact-from").submit(function (event) {
    event.preventDefault();
  });
  $("#send").click(function () {
    AjouterContact();
  });
  // This script uses window.innerHeight + window.scrollY to get the current bottom position 
  // of the viewport and compares it with document.body.offsetHeight to determine if 
  // the user has reached the bottom of the page. If they have, the "back to top" 
  // button is shown by adding the active class. Otherwise, the active class is removed, hiding the button.
  let backtotop = document.getElementsByClassName("back-to-top")[0];
  if (backtotop) {
    const toggleBacktotop = () => {
      // Check if the user has scrolled to the bottom of the page
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    window.addEventListener("scroll", toggleBacktotop);
  }
});
/* ------------------------- Récupération du contenu ------------------------ */
function GetContenus() {
  fetch(API_URLS.API_BASE_URL + "AfficherContenusFo")
    .then((response) => {
      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response?.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (data?.api_message !== "success") {
        return;
      }
      /* ------------------------- Mise à jour de l'email ------------------------- */
      if (data?.footer_mail) {
        footer_mail = data?.footer_mail;
        updateMailto(data?.footer_mail);
      }
      /* ------------------------- Mise à jour du phone ------------------------- */
      if (data?.phone) {
        phone = data?.phone;
        updatePhoneto(data?.phone);
      }
      data?.Data.forEach((item) => {
        var currentLang = localStorage.getItem("current_lang");
        var element = document.getElementById(item?.html_id);
        if (element) {
          switch (currentLang) {
            case "fr":
              if (item?.description_fr) { element.innerHTML = item?.description_fr; }
              break;
            case "ar":
              if (item?.description_ar) { element.innerHTML = item?.description_ar; }
              break;
            default:
              if (item?.description_fr) { element.innerHTML = item?.description_fr; }
              break;
          }
        }
      });
    })
    .catch((error) => {
      console.log(error);
      swal_error_success("Oups quelque chose a mal tourné ...");
    });
}
/* --------------------- Mise à jour du mail de contacte -------------------- */
function updateMailto(email) {
  var emailLink = document.getElementById("emailLink");
  if (emailLink) emailLink.href = "mailto:" + email;
  var footer_mail = document.getElementById("footer_mail");
  if (footer_mail) footer_mail.href = "mailto:" + email;
}
/* --------------------- Mise à jour du mail de contacte -------------------- */
function updatePhoneto(_phone) {
  var footer_phone = document.getElementById("footer_phone");
  if (footer_phone) footer_phone.href = "tel:" + _phone;
  var phoneLink = document.getElementById("phoneLink");
  if (phoneLink) phoneLink.href = "tel:" + _phone;
  var num_wtsp = document.getElementById("num_wtsp");
  if (num_wtsp) num_wtsp.href = `https://wa.me/${formatPhoneNumber(_phone)}`
}
// Fonction pour remplacer le premier '0' par '212'
function formatPhoneNumber(phoneNumber) {
  return phoneNumber.replace(/^0/, '212');
}
/* ------------------------- Récupération du contenu ------------------------ */
function AfficherContactsSubjects() {
  $.ajax({
    url: API_URLS.API_BASE_URL + "AfficherContactsSubjects", // Replace with your API URL
    type: "GET", // Method type (GET, POST, etc.)
    dataType: "json", // Type of data expected to receive
    success: function (response) {
      if (response?.api_message != "success") {
        return;
      }
      $.each(response.Data, function (index, item) {
        // 'item' is the current element in the array
        var _itemElement = $(
          `<option value="${item.value}">${item.label}</option>`
        );
        $("#sujet_contact").append(_itemElement);
      });
    },
    error: function (xhr, status, error) {
      // Handle error
      console.error("Error:", error);
    },
  });
}
/* ------------------------- Récupération du contenu ------------------------ */
function AjouterContact() {
  if (
    $("#sujet_contact").val() == "" ||
    $("#email_contact").val() == "" ||
    $("#first_and_last_name").val() == "" ||
    $("#message_contact").val() == ""
  ) {
    swal_error_success("Formulaire invalide !", 5000, "error", "Le message doit contenir 10 lettres au minimum !");
    return;
  }
  let body = {
    sujet_contact: $("#sujet_contact").val(),
    email_contact: $("#email_contact").val(),
    first_and_last_name: $("#first_and_last_name").val(),
    message_contact: $("#message_contact").val(),
  };
  $.ajax({
    type: "POST",
    url: API_URLS.API_BASE_URL + "AjouterContact", // Replace with your API URL
    data: JSON.stringify(body),
    contentType: "application/json",
    success: function (response) {
      switch (response?.api_message) {
        case "ajouter":
          $("#contact-from")[0].reset();
          swal_error_success("Votre message a été envoyé. Merci !", 2000, "success");
          break;
        case "erreur_de_parametres":
          swal_error_success("Formulaire invalide !", 5000, "error");
          break;
        default:
          swal_error_success("Oups quelque chose a mal tourné ...");
          break;
      }
    },
    error: function (xhr, status, error) {
      swal_error_success("Oups quelque chose a mal tourné ...");
    },
  });
}
/* --------------------------- Gestion des erreurs -------------------------- */
function swal_error_success(message, duration = 2000, icon = "error", text = null, showConfirmButton = false) {
  Swal.fire({
    scrollbarPadding: false,
    icon: icon,
    title: message,
    text: text,
    showConfirmButton: showConfirmButton,
    timer: duration
  });
}
