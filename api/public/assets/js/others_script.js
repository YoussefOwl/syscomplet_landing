/* ------------------------ Déclaration des variables ----------------------- */
const prod_mode = true;
const API_URLS = {
  API_BASE_URL: prod_mode
    ? "https://api.optiques.ma/api/"
    : "http://localhost:8000/api/"
};
var footer_mail = "";
var phone = "";
/* -------------------- Les founction à executer au début ------------------- */
$(document).ready(function () {
  if (window.innerWidth <= 992) { // Supposons que 992px est votre seuil pour les appareils mobiles
    const pdfContainers = document.querySelectorAll('.responsive-pdf-container');
    pdfContainers.forEach(function(container) {
      container.remove(); // Supprime l'élément du DOM
    });
  }
  localStorage.setItem("current_lang", "fr");
  GetContenus();
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
      /* ------------------------- Mise à jour de l'email ------------------------- */
      if (data?.phone) {
        phone = data?.phone;
        updatePhoneto(data?.phone);
      }
      var loading_image = document.getElementById('loading_image');
      if (loading_image) {
        loading_image.parentNode.removeChild(loading_image);
      }
      data?.Data.forEach((item) => {
        var currentLang = localStorage.getItem("current_lang");
        var element = document.getElementById(item?.html_id);
        if (element) {
          switch (currentLang) {
            case "fr":
              if (item?.description_fr) {
                element.innerHTML = item?.description_fr;
              }
              break;
            case "ar":
              if (item?.description_ar) {
                element.innerHTML = item?.description_ar;
              }
              break;
            default:
              if (item?.description_fr) {
                element.innerHTML = item?.description_fr;
              }
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
}
/* --------------------- Mise à jour du mail de contacte -------------------- */
function updatePhoneto(_phone) {
  var phoneLink = document.getElementById("phoneLink");
  if (phoneLink) phoneLink.href = "tel:" + _phone;
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
