const currentDate = document.querySelector(".current-date");
const daysTag = document.querySelector(".days");
const prevNextIcon = document.querySelectorAll(".icons svg");

// Date actuelle : le calendrier s'ouvre sur le mois en cours
let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();

const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

// Convertit getDay() (0 = Dimanche) en index où Lundi = 0
const mondayIndex = (day) => (day + 6) % 7;

const renderCalendar = () => {
    const today = new Date(); // date réelle, recalculée à chaque rendu

    const firstDayofmonth = mondayIndex(new Date(currYear, currMonth, 1).getDay());
    const lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDayofmonth = mondayIndex(new Date(currYear, currMonth, lastDateofMonth).getDay());
    const lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

    let liTag = "";

    // Jours du mois précédent
    for (let i = firstDayofmonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    // Jours du mois courant
    for (let i = 1; i <= lastDateofMonth; i++) {
        const isToday =
            i === today.getDate() &&
                currMonth === today.getMonth() &&
                currYear === today.getFullYear()
                ? "active"
                : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    // Jours du mois suivant
    for (let i = lastDayofmonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofmonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
};

renderCalendar();

prevNextIcon.forEach((icon) => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        // Gestion du changement d'année
        if (currMonth < 0) {
            currMonth = 11;
            currYear--;
        } else if (currMonth > 11) {
            currMonth = 0;
            currYear++;
        }

        renderCalendar();
    });
});