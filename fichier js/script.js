// Récupération des éléments
const lienDeconnexion = document.getElementById("deconnexion");
const overlay = document.querySelector(".overlay");
const boutonAnnuler = document.getElementById("annuler");
const boutonConfirmer = document.getElementById("confirmer");

// Clic sur Deconnexion
lienDeconnexion.addEventListener("click", (event) => {
    event.preventDefault();
    overlay.style.display = "flex";
});

// Clic sur "Annuler" : on cache la modale
boutonAnnuler.addEventListener("click", () => {
    overlay.style.display = "none";
});

// Clic sur "Oui, deconnecter" : on oublie la personne connectée et on retourne à la connexion
boutonConfirmer.addEventListener("click", () => {
    sessionStorage.removeItem("todopro_session");
    window.location.href = "login.html";
});