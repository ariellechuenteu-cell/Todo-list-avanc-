// ----- Afficher le prénom de l'utilisateur dans le header -----
function afficherPrenom() {
    // id de la personne connectée (gardé à la connexion)
    const idConnecte = sessionStorage.getItem("todopro_session");

    // liste de tous les comptes
    const utilisateurs = JSON.parse(localStorage.getItem("todopro_users")) || [];

    // on cherche le compte de la personne connectée
    const moi = utilisateurs.find((u) => u.id === idConnecte);

    // si on l'a trouvé, on écrit son prénom dans chaque <span id="userName">
    if (moi) {
        document.querySelectorAll("#userName").forEach((zone) => {
            zone.textContent = moi.prenom;
        });
    }
}
afficherPrenom();
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