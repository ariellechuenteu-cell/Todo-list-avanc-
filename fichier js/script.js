// ---- Références DOM ----
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");
const counter = document.getElementById("counter");

const STORAGE_KEY = "todo-tasks";

// ---- État : le tableau est la seule source de vérité ----
// On récupère les tâches sauvegardées au chargement (ou un tableau vide sinon)
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ---- Sauvegarde ----
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ---- Affichage : on reconstruit toute la liste à partir du tableau ----
function render() {
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""} data-id="${task.id}">
      <span class="${task.done ? "done" : ""}">${escapeHtml(task.text)}</span>
      <button type="button" data-id="${task.id}">Supprimer</button>
    `;

    list.appendChild(li);
  });

  emptyMsg.style.display = tasks.length === 0 ? "block" : "none";

  const restantes = tasks.filter(t => !t.done).length;
  counter.textContent = tasks.length
    ? `${restantes} tâche(s) restante(s) sur ${tasks.length}`
    : "";
}

// Petite sécurité pour éviter d'injecter du HTML depuis le texte tapé
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---- Ajouter une tâche ----
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (text === "") return;

  tasks.push({
    id: Date.now(), // identifiant unique simple
    text: text,
    done: false
  });

  save();
  render();

  input.value = "";
  input.focus();
});

// ---- Cocher / supprimer : délégation d'événements sur le <ul> ----
list.addEventListener("click", (event) => {
  const id = Number(event.target.dataset.id);
  if (!id) return;

  if (event.target.matches("input[type='checkbox']")) {
    const task = tasks.find(t => t.id === id);
    task.done = !task.done;
  }

  if (event.target.matches("button")) {
    tasks = tasks.filter(t => t.id !== id);
  }

  save();
  render();
});

// ---- Affichage initial (tâches restaurées du localStorage) ----
render();
