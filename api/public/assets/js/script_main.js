
/* ------------------------ Déclaration des variables ----------------------- */
const prod_mode = false;
var footer_mail = "";
var phone = "";
var link_facebook;
var link_instagram;
const API_URLS = {
  API_BASE_URL: prod_mode
    ? "https://api.cameras.ma/api/"
    : "http://localhost:8000/api/",
  API_BASE_STORAGE_PARTENAIRES: prod_mode
    ? "https://api.cameras.ma/storage/partenaires/"
    : "http://localhost:8000/storage/partenaires/",
};
/* -------------------- Les founction à executer au début ------------------- */
document.addEventListener("DOMContentLoaded", function () {
  /* -------------------------------------------------------------------------- */
  /*                                   Navbar                                   */
  /* -------------------------------------------------------------------------- */
  var mobileNavToggle = document.querySelector(".mobile-nav-toggle");
  var navBar = document.querySelector("#navbar");
  // Function to toggle the mobile navigation
  function toggleMobileNav() {
    navBar.classList.toggle("navbar-mobile-show");
  }
  // Event listener for mobile nav toggle
  mobileNavToggle.addEventListener("click", toggleMobileNav);
  // Event listeners for nav links to hide the navbar on click
  document.querySelectorAll("#navbar .nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      if (navBar.classList.contains("navbar-mobile-show")) {
        toggleMobileNav(); // Hide the mobile navigation
      }
    });
  });
  /* -------------------------------------------------------------------------- */
  /*                               Galery casousel                              */
  /* -------------------------------------------------------------------------- */
  if (document.querySelector("#carouselExampleIndicators")) {
    new bootstrap.Carousel(
      document.querySelector("#carouselExampleIndicators"),
      {
        interval: 5000,
        wrap: true,
      }
    );
  }
  if (document.querySelector("#carouselGestion")) {
    new bootstrap.Carousel(document.querySelector("#carouselGestion"), {
      interval: 5000,
      wrap: true,
    });
  }
  localStorage.setItem("current_lang", "fr");
  PartenairesCarousel();
  $("#contact-from").submit(function (event) {
    event.preventDefault();
  });
  $("#newsletter_from").submit(function (event) {
    event.preventDefault();
  });
  $("#send").click(function () {
    AjouterContact();
  });
  $("#send-news").click(function () {
    AjouterNewsletters();
  });
  /* ----------------------- Les clicks sur les bouttons ---------------------- */
if (document.getElementById("bloc_1_app_link_devis"))
    document.getElementById("bloc_1_app_link_devis")
    .addEventListener("click", function () {
      HowToGetDevis();
    });
  // This script uses window.innerHeight + window.scrollY to get the current bottom position
  // of the viewport and compares it with document.body.offsetHeight to determine if
  // the user has reached the bottom of the page. If they have, the "back to top"
  // button is shown by adding the active class. Otherwise, the active class is removed, hiding the button.
  let backtotop = document.getElementsByClassName("back-to-top")[0];
  if (backtotop) {
    const toggleBacktotop = () => {
      // Check if the user has scrolled to the bottom of the page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    window.addEventListener("scroll", toggleBacktotop);
  }
});
// Fonction pour remplacer le premier '0' par '212'
function formatPhoneNumber(phoneNumber) {
  return phoneNumber.replace(/^0/, "212");
}
/* -------------------------- Fonction pour ouvrir -------------------------- */
function HowToGetDevis() {
  Swal.fire({
    icon: "info",
    scrollbarPadding: false,
    title: "Demande de devis ou d'une demo ?",
    confirmButtonColor: "#3085d6",
    showConfirmButton: true,
    allowOutsideClick: false,
    html: `
    Pour un devis, contactez-nous par email : <a href="mailto:${footer_mail}">${footer_mail}</a>, téléphone : <a href="tel:${phone}">${phone}</a>, ou via le formulaire de contact (sujet : "Demande de devis ou d'une demo"). Réponse rapide assurée !`
  }).then((result) => {
    if (result?.isConfirmed) {
      window.location.href = "contact.html";
    }
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
  if (num_wtsp) num_wtsp.href = `https://wa.me/${formatPhoneNumber(_phone)}`;
}
/* ---------------------- Récupération des partenaires ---------------------- */
function PartenairesCarousel() {
  new Swiper(".partenaires_carousel", {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    slidesPerView: 4, // Number of slides visible at once
     // Space between slides in pixels
      pagination: {
        el: ".swiper-pagination",
        type: "fraction", // Other types include 'fraction', 'progressbar', or 'custom'
      clickable: true, // Allow pagination bullets to be clickable
    },
  });
}
/* ------------------------ Inscription au BULLETIN D'INFORMATION  --------- */
function AjouterNewsletters() {
  if ($("#email-news").val() == "") {
    $("#error-message-news").text("Formulaire invalide");
    $("#error-message-news").show();
    setTimeout(() => {
      $("#error-message-news").hide();
    }, 2500);
    return;
  }
  let body = {
    email_newsletter: $("#email-news").val(),
  };
  $.ajax({
    type: "POST",
    url: API_URLS.API_BASE_URL + "AjouterNewsletter", // Replace with your API URL
    data: JSON.stringify(body),
    contentType: "application/json",
    success: function (response) {
      if (response?.api_message == "ajouter") {
        $("#sent-message-news").show();
        $("#newsletter_from")[0].reset();
      } else {
        $("#error-message-news").text("Email existant !");
        $("#error-message-news").show();
      }
      setTimeout(() => {
        $("#error-message-news").hide();
        $("#sent-message-news").hide();
      }, 2500);
    },
    error: function (xhr, status, error) {
      // Handle error
      console.log("Error:", error);
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
    swal_error_success(
      "Formulaire invalide !",
      5000,
      "error",
      "Le message doit contenir 10 lettres au minimum !"
    );
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
          swal_error_success(
            "Votre message a été envoyé. Merci !",
            2000,
            "success"
          );
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
function swal_error_success(
  message,
  duration = 2000,
  icon = "error",
  text = null,
  showConfirmButton = false
) {
  Swal.fire({
    scrollbarPadding: false,
    icon: icon,
    title: message,
    text: text,
    showConfirmButton: showConfirmButton,
    timer: duration,
  });
}
