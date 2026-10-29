// Lit la liste de tous les comptes créés
function getUsers() {
    const texte = localStorage.getItem("todopro_users") || "[]";
    return JSON.parse(texte);
}

// Enregistre la liste de tous les comptes
function saveUsers(utilisateurs) {
    localStorage.setItem("todopro_users", JSON.stringify(utilisateurs));
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
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTelephone = /^(\+?237)?6[0-9]{8}$/;
const boutonInscription = document.getElementById("submit-btn");

// Le bouton Connexion renvoie vers la page de connexion
document.getElementById("login-btn").addEventListener("click", () => {
    window.location.href = "login.html";
});

// Clic sur "S'inscrire"
boutonInscription.addEventListener("click", () => {
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const telephone = document.getElementById("telephone").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const motDePasse = document.getElementById("password").value;
    const confirmation = document.getElementById("password-confirmation").value;
    const termesAcceptes = document.getElementById("termes").checked;

    if (!nom || !prenom || !telephone || !email || !motDePasse || !confirmation) {
        afficherMessage("Tous les champs sont obligatoires.", false);
        return;
    }
    if (!regexEmail.test(email)) {
        afficherMessage("Le format de l'e-mail est invalide.", false);
        return;
    }
    if (!regexTelephone.test(telephone.replaceAll(" ", ""))) {
        afficherMessage("Numéro invalide. Exemple : 659030225 ou +237 659030225", false);
        return;
    }
    if (motDePasse.length < 8) {
        afficherMessage("Le mot de passe doit contenir au moins 8 caractères.", false);
        return;
    }
    if (motDePasse !== confirmation) {
        afficherMessage("Les mots de passe ne sont pas identiques.", false);
        return;
    }
    if (!termesAcceptes) {
        afficherMessage("Vous devez accepter les termes et conditions.", false);
        return;
    }

    // Vérifier que l'e-mail n'est pas déjà utilisé
    const utilisateurs = getUsers();
    if (utilisateurs.some((u) => u.email === email)) {
        afficherMessage("Un compte existe déjà avec cet e-mail.", false);
        return;
    }

    // créer le nouvel utilisateur
    const nouvelUtilisateur = {
        id: Date.now().toString(),
        nom: nom,
        prenom: prenom,
        telephone: telephone,
        email: email,
        motDePasse: motDePasse
    };

    //ajouter l'utilisateur à la liste, puis enregistrer la liste dans le localStorage
    utilisateurs.push(nouvelUtilisateur);
    saveUsers(utilisateurs);

    // Message de succès puis redirection vers la page de connexion
    afficherMessage("Compte créé ! Redirection...", true);
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
});