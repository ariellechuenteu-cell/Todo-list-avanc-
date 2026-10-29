// Donne l'identifiant de la personne connectée
function getSession() {
    return sessionStorage.getItem("todopro_session");
}

// Oublie la personne connectée (déconnexion)
function clearSession() {
    sessionStorage.removeItem("todopro_session");
}

// Lit la liste de tous les comptes créés
function getUsers() {
    const texte = localStorage.getItem("todopro_users") || "[]";
    return JSON.parse(texte);
}

// Enregistre la liste de tous les comptes
function saveUsers(utilisateurs) {
    localStorage.setItem("todopro_users", JSON.stringify(utilisateurs));
}

// Retourne le compte de la personne connectée
function getCurrentUser() {
    const id = getSession();
    if (!id) return null;
    // find() cherche le premier compte dont l'id correspond
    return getUsers().find((u) => u.id === id) || null;
}

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTelephone = /^(\+?237)?[26][0-9]{8}$/;

// affiche un message d'erreur ou de succes
function afficherMessage(texte, succes) {
    const message = document.getElementById("message");
    message.textContent = texte;
    if (succes === true) {
        message.style.color = "green";
    } else {
        message.style.color = "red";
    }
}

// Recuperation des elements html
const champs = document.querySelectorAll(".formular input");
const boutonEnregistrer = document.querySelector(".formular-actions button");
const boutonMotDePasse = document.querySelector(".box-edit1-2 button");
const boutonSupprimerCompte = document.querySelector(".box-delete1-2 button");

// on verifie si un utilisateur est connecte
const compteConnecte = getCurrentUser();
if (compteConnecte === null) {
    window.location.href = "login.html";
}

// Affichage des informations de l'utilisateur
function remplirFormulaire() {
    champs[0].value = compteConnecte.nom;
    champs[1].value = compteConnecte.prenom;
    champs[2].value = compteConnecte.telephone;
    champs[3].value = compteConnecte.email;
    document.getElementById("userName").textContent = compteConnecte.prenom;
}
if (compteConnecte !== null) {
    remplirFormulaire();
}

// Modification des informations de l'utilisateur
boutonEnregistrer.addEventListener("click", (e) => {
    const nom = champs[0].value.trim();
    const prenom = champs[1].value.trim();
    const telephone = champs[2].value.trim();
    const email = champs[3].value.trim().toLowerCase();

    if (!nom || !prenom || !telephone || !email) {
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

    const utilisateurs = getUsers();

    // L'e-mail ne doit pas être celui d'un autre utilisateur
    if (utilisateurs.some((u) => u.email === email && u.id !== compteConnecte.id)) {
        afficherMessage("Un compte existe déjà avec cet e-mail.", false);
        return;
    }

    // On retrouve notre compte dans la liste et on change ses informations
    const moi = utilisateurs.find((u) => u.id === compteConnecte.id);
    moi.nom = nom;
    moi.prenom = prenom;
    moi.telephone = telephone;
    moi.email = email;
    saveUsers(utilisateurs);

    document.getElementById("userName").textContent = prenom;
    afficherMessage("Informations enregistrées !", true);
});

// Modification du mot de passe
const overlayMdp = document.getElementById("overlayMotDePasse");
const ancienMdp = document.getElementById("ancienMdp");
const nouveauMdp = document.getElementById("nouveauMdp");
const confirmationMdp = document.getElementById("confirmationMdp");
const messageMdp = document.getElementById("messageMdp");

// Message dans la modale du mot de passe
function afficherMessageMdp(texte, succes) {
    messageMdp.textContent = texte;
    if (succes === true) {
        messageMdp.style.color = "green";
    } else {
        messageMdp.style.color = "red";
    }
}

// Ferme la modale et vide ses champs
function fermerModaleMdp() {
    overlayMdp.style.display = "none";
    ancienMdp.value = "";
    nouveauMdp.value = "";
    confirmationMdp.value = "";
    messageMdp.textContent = "";
}

// Clic sur "Modifier" : on affiche la modale
boutonMotDePasse.addEventListener("click", () => {
    overlayMdp.style.display = "flex";
});

// Clic sur "Annuler"
document.getElementById("annulerMdp").addEventListener("click", fermerModaleMdp);

// Clic sur "Enregistrer" dans la modale
document.getElementById("validerMdp").addEventListener("click", () => {
    const utilisateurs = getUsers();
    const moi = utilisateurs.find((u) => u.id === compteConnecte.id);

    if (ancienMdp.value !== moi.motDePasse) {
        afficherMessageMdp("Ancien mot de passe incorrect.", false);
        return;
    }
    if (nouveauMdp.value.length < 8) {
        afficherMessageMdp("Le mot de passe doit contenir au moins 8 caractères.", false);
        return;
    }
    if (nouveauMdp.value !== confirmationMdp.value) {
        afficherMessageMdp("Les mots de passe ne sont pas identiques.", false);
        return;
    }

    moi.motDePasse = nouveauMdp.value;
    saveUsers(utilisateurs);
    afficherMessageMdp("Mot de passe modifié !", true);
    setTimeout(fermerModaleMdp, 1200);
});

// Suppresion du compte apres confirmation
boutonSupprimerCompte.addEventListener("click", () => {
    const confirme = confirm("Cette action est irréversible. Supprimer votre compte et toutes vos données ?");

    if (confirme === true) {
        // On garde tous les comptes SAUF le nôtre
        saveUsers(getUsers().filter((u) => u.id !== compteConnecte.id));
        // On supprime aussi nos tâches et nos dossiers
        localStorage.removeItem("todopro_tasks_" + compteConnecte.id);
        localStorage.removeItem("todopro_folders_" + compteConnecte.id);
        clearSession();
        window.location.href = "login.html";
    }
});

// Deconnexion
const overlayDeco = document.querySelector(".overlay");
const lienDeco = document.getElementById("deconnexion");
const btnAnnulerDeco = document.getElementById("annuler");
const btnConfirmerDeco = document.getElementById("confirmer");


lienDeco.addEventListener("click", (event) => {
    event.preventDefault();
    overlayDeco.style.display = "flex";
});

// Clic sur "Annuler"
btnAnnulerDeco.addEventListener("click", () => {
    overlayDeco.style.display = "none";
});

// Clic sur "Oui, deconnecter"
btnConfirmerDeco.addEventListener("click", () => {
    clearSession();

    // On remplace le contenu de la modale par un message
    document.querySelector(".overlay .modal h2").textContent = "Déconnexion réussie";
    document.querySelector(".overlay .modal p").textContent = "Vous avez été déconnecté(e). Redirection...";
    btnAnnulerDeco.style.display = "none";
    btnConfirmerDeco.style.display = "none";

    // Après 1,5 seconde, retour à la page de connexion
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
});