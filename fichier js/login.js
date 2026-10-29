// Lit la liste de tous les comptes créés
function getUsers() {
    const texte = localStorage.getItem("todopro_users") || "[]";
    return JSON.parse(texte);
}

// Enregistre la liste de tous les comptes
function saveUsers(utilisateurs) {
    localStorage.setItem("todopro_users", JSON.stringify(utilisateurs));
}

// Mémorise quelle personne vient de se connecter
function setSession(idUtilisateur) {
    sessionStorage.setItem("todopro_session", idUtilisateur);
}

function afficherMessage(texte, succes) {
    const message = document.getElementById("message");
    message.textContent = texte;
    if (succes === true) {
        message.style.color = "green";
    } else {
        message.style.color = "red";
    }
}


const formulaire = document.getElementById("formulaire");
const boutonConnexion = document.getElementById("submit-btn");

// Le bouton s'inscrire renvoie vers la page d'inscription
document.getElementById("login-btn").addEventListener("click", () => {
    window.location.href = "sign.html";
});

// "Mot de passe oublié ?" : pas de réinitialisation prévue dans le projet
document.getElementById("lien").addEventListener("click", (event) => {
    event.preventDefault();
    afficherMessage("La réinitialisation du mot de passe n'est pas disponible.", false);
});

// Envoi du formulaire de connexion
formulaire.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const motDePasse = document.getElementById("password").value;

    if (!email || !motDePasse) {
        afficherMessage("Veuillez remplir tous les champs.", false);
        return;
    }

    // On cherche l'utilisateur et on compare le mot de passe
    // (find renvoie le compte trouvé, ou undefined si aucun compte ne correspond)
    const utilisateur = getUsers().find((u) => u.email === email && u.motDePasse === motDePasse);

    // Si aucun compte ne correspond : message d'erreur et on s'arrête
    if (!utilisateur) {
        afficherMessage("E-mail ou mot de passe incorrect.", false);
        return;
    }

    // Connexion réussie : on mémorise la personne et on va au tableau de bord
    setSession(utilisateur.id);
    window.location.href = "index.html";
});