document.addEventListener("DOMContentLoaded", function() {
    let events = [];
    let eventDateInput = document.getElementById('eventDate');
    let eventTitleInput = document.getElementById('eventTitle');
    let eventDesInput = document.getElementById('eventDescription');
    let reminderList = document.getElementById("remainderList");
    let eventIdCounter = 1;

    function addEvent() {
        let date = eventDateInput.value;
        let title = eventTitleInput.value;
        let descrp = eventDesInput.value;
        if (date && title) {
            let eventId = eventIdCounter++;
            events.push({
                id: eventId,
                date: date,
                title: title,
                description: descrp
            });
            alert('Task added');
            eventDateInput.value = "";
            eventDesInput.value = "";
            eventTitleInput.value = "";
            displayReminders();
        }
    }

    function displayReminders() {
        reminderList.innerHTML = "";
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            let eventDate = new Date(event.date);
            let listItem = document.createElement("li");
            let options = { weekday: 'long', month: 'numeric', day: 'numeric', year: 'numeric' };
            listItem.innerHTML = `<strong>${event.title}</strong> - ${event.description} on ${eventDate.toLocaleDateString('en-us', options)}`;
            let deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-event";
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = function() {
                events = events.filter(e => e.id !== event.id);
                displayReminders();
            };
            listItem.appendChild(deleteBtn);
            reminderList.appendChild(listItem);
        }
    }

    document.getElementById('addEvent').addEventListener('click', addEvent);

    // Calendar functionality
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let selectYear = document.getElementById("year");
    let selectMonth = document.getElementById("month");
    let monthAndYear = document.getElementById("monthAndYear");

    function generate_year_range(start, end) {
        let years = "";
        for (let year = start; year <= end; year++) {
            years += `<option value='${year}'>${year}</option>`;
        }
        return years;
    }

    function daysInMonth(iMonth, iYear) {
        return 32 - new Date(iYear, iMonth, 32).getDate();
    }

    function showCalendar(month, year) {
        let firstDay = new Date(year, month).getDay();
        let tbl = document.getElementById("calendar-body");
        tbl.innerHTML = "";
        monthAndYear.innerHTML = `${months[month]} ${year}`;
        selectYear.value = year;
        selectMonth.value = month;

        let date = 1;
        for (let i = 0; i < 6; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    let cell = document.createElement("td");
                    cell.innerHTML = "";
                    row.appendChild(cell);
                } else if (date > daysInMonth(month, year)) {
                    break;
                } else {
                    let cell = document.createElement("td");
                    cell.classList.add('date-picker');
                    cell.innerHTML = date;
                    let cellDate = new Date(year, month, date).toISOString().split('T')[0];
                    if (events.find(event => event.date === cellDate)) {
                        cell.classList.add('event-marker');
                    }
                    cell.onclick = function() {
                        alert(`Date: ${cellDate}`);
                    };
                    if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                        cell.classList.add("selected");
                    }
                    row.appendChild(cell);
                    date++;
                }
            }
            tbl.appendChild(row);
        }
    }

    function next() {
        currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
        currentMonth = (currentMonth + 1) % 12;
        showCalendar(currentMonth, currentYear);
    }

    function previous() {
        currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
        currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
        showCalendar(currentMonth, currentYear);
    }

    function jump() {
        currentYear = parseInt(selectYear.value);
        currentMonth = parseInt(selectMonth.value);
        showCalendar(currentMonth, currentYear);
    }

    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    selectYear.innerHTML = generate_year_range(1970, 2050);
    showCalendar(currentMonth, currentYear);

    document.getElementById('previous').addEventListener('click', previous);
    document.getElementById('next').addEventListener('click', next);
    selectYear.addEventListener('change', jump);
    selectMonth.addEventListener('change', jump);
});
