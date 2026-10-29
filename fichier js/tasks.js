// Récupération des éléments HTML
const formulaire = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDate = document.getElementById("taskDate");
const folderColor = document.getElementById("folderColor");
const taskFolder = document.getElementById("taskFolder");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");
const boutonAjouter = document.getElementById("ajouterBtn");

// Éléments pour rechercher et filtrer
const searchInput = document.getElementById("searchInput");
const filterPriority = document.getElementById("filterPriority");
const filterState = document.getElementById("filterState");

// Au moment de la connexion, on a gardé l'id de la personne dans sessionStorage
const idUtilisateur = sessionStorage.getItem("todopro_session");
if (!idUtilisateur) {
    window.location.href = "login.html";
}

// Récupérer les tâches et les dossiers sauvegardés
let taches = JSON.parse(localStorage.getItem("todopro_tasks_" + idUtilisateur)) || [];
const dossiers = JSON.parse(localStorage.getItem("todopro_folders_" + idUtilisateur)) || [];

// Fonction pour sauvegarder les tâches
function saveTask() {
    localStorage.setItem("todopro_tasks_" + idUtilisateur, JSON.stringify(taches));
}

// La tâche qu'on est en train de modifier
let tacheEnModification = null;

// Pour afficher la priorité en français
const nomsPriorite = { high: "Urgente", medium: "Moyenne", low: "Faible" };

// Si on arrive depuis la page des dossiers : tache.html?dossier=123
const idDossierUrl = new URLSearchParams(window.location.search).get("dossier");

// Remplir la liste déroulante des dossiers
function remplirDossiers() {
    taskFolder.innerHTML = "";

    // Première option : pas de dossier
    const optionVide = document.createElement("option");
    optionVide.value = "";
    optionVide.textContent = "Sans dossier";
    taskFolder.append(optionVide);

    // Une option par dossier créé
    dossiers.forEach((dossier) => {
        const option = document.createElement("option");
        option.value = dossier.id;
        option.textContent = dossier.name;
        taskFolder.append(option);
    });
}

// Afficher les tâches
function afficherTaches() {
    // Vider la liste
    taskList.innerHTML = "";

    // On part de TOUTES les tâches, puis on enlève celles qui ne correspondent pas
    let tachesAffichees = taches;

    // Recherche par nom
    const recherche = searchInput.value.trim().toLowerCase();
    if (recherche !== "") {
        tachesAffichees = tachesAffichees.filter((tache) => tache.title.toLowerCase().includes(recherche));
    }

    // Filtre par priorité
    if (filterPriority.value !== "all") {
        tachesAffichees = tachesAffichees.filter((tache) => tache.priority === filterPriority.value);
    }

    // Filtre par état
    if (filterState.value === "done") {
        tachesAffichees = tachesAffichees.filter((tache) => tache.done === true);
    }
    if (filterState.value === "pending") {
        tachesAffichees = tachesAffichees.filter((tache) => tache.done === false);
    }
    if (filterState.value === "late") {
        // en retard = pas terminée ET date déjà passée
        tachesAffichees = tachesAffichees.filter((tache) => tache.done === false && new Date(tache.date) < new Date());
    }

    // Si on vient de la page des dossiers
    if (idDossierUrl !== null) {
        tachesAffichees = tachesAffichees.filter((tache) => tache.folderId === idDossierUrl);
    }

    // Message si la liste est vide
    if (tachesAffichees.length === 0) {
        const vide = document.createElement("li");
        vide.textContent = "Aucune tache a afficher.";
        taskList.append(vide);
        return;
    }

    // Créer une ligne pour chaque tâche
    tachesAffichees.forEach((tache) => {
        // Créer un élément li
        const li = document.createElement("li");
        li.style.borderLeftColor = tache.color;

        // Case à cocher "terminée"
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tache.done;
        checkbox.addEventListener("change", () => {
            tache.done = checkbox.checked;
            saveTask();
            afficherTaches();
        });

        // Titre (barré si la tâche est terminée)
        const span = document.createElement("span");
        span.textContent = tache.title;
        if (tache.done) {
            span.style.textDecoration = "line-through";
        }

        // Infos : date, priorité, dossier
        const infos = document.createElement("small");
        let texteInfos = " | " + new Date(tache.date).toLocaleString("fr-FR") + " | " + nomsPriorite[tache.priority];
        const dossier = dossiers.find((d) => d.id === tache.folderId);
        if (dossier) {
            texteInfos += " | " + dossier.name;
        }
        infos.textContent = texteInfos;

        // Bouton Modifier
        const editBtn = document.createElement("button");
        editBtn.textContent = "Modifier";
        editBtn.className = "btn-modifier"
        editBtn.addEventListener("click", () => {
            tacheEnModification = tache;
            taskTitle.value = tache.title;
            taskDate.value = tache.date;
            folderColor.value = tache.color;
            taskFolder.value = tache.folderId;
            taskPriority.value = tache.priority;
            boutonAjouter.textContent = "Enregistrer les modifications";
        });

        // Bouton Supprimer
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Supprimer";
        deleteBtn.className = "btn-supprimer"
        deleteBtn.addEventListener("click", () => {
            if (confirm("Supprimer cette tache ?")) {
                taches.splice(taches.indexOf(tache), 1);

                // Si on était en train de modifier cette tâche, on annule la modification
                if (tacheEnModification === tache) {
                    tacheEnModification = null;
                    formulaire.reset();
                    boutonAjouter.textContent = "Ajouter la tache";
                }

                saveTask();
                afficherTaches();
            }
        });

        li.append(checkbox, span, infos, editBtn, deleteBtn);
        taskList.append(li);
    });
}

// Ajouter ou modifier une tâche
formulaire.addEventListener("submit", (event) => {
    event.preventDefault(); // empêche la page de se recharger

    const titre = taskTitle.value.trim();

    // Vérifier si le champ est vide
    if (titre === "") {
        alert("Veuillez entrer une tache");
        return;
    }

    // Vérifier que la date est choisie
    if (taskDate.value === "") {
        alert("Veuillez choisir une date");
        return;
    }

    if (tacheEnModification === null) {
        //on crée une nouvelle tâche et on l'ajoute au tableau
        taches.push({
            title: titre,
            date: taskDate.value,
            color: folderColor.value,
            folderId: taskFolder.value,
            priority: taskPriority.value || "medium",
            done: false
        });
    } else {
        // MODIFICATION
        tacheEnModification.title = titre;
        tacheEnModification.date = taskDate.value;
        tacheEnModification.color = folderColor.value;
        tacheEnModification.folderId = taskFolder.value;
        tacheEnModification.priority = taskPriority.value || "medium";

        tacheEnModification = null;
        boutonAjouter.textContent = "Ajouter la tache";
    }

    saveTask();
    formulaire.reset();
    afficherTaches();
});

// Recherche et filtres
searchInput.addEventListener("input", afficherTaches);
filterPriority.addEventListener("change", afficherTaches);
filterState.addEventListener("change", afficherTaches);

// Au chargement de la page
remplirDossiers();
if (idDossierUrl !== null) {
    taskFolder.value = idDossierUrl;
}
afficherTaches();