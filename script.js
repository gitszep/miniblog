document.addEventListener('DOMContentLoaded', () => {
    loadTableData();
    loadImages();
    loadTextItems();
});

// Dodaj wpis tekstowy
document.getElementById('addButton').addEventListener('click', function() {
    const input = document.getElementById('textInput');
    const contentDiv = document.getElementById('content');

    if (input.value.trim() !== '') {
        addTextItem(input.value); // Dodaj nowy element
        saveTextItems(); // Zapisz wszystkie wpisy
        input.value = ''; // Wyczyść input po dodaniu
    }
});

// Dodaj obraz
document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgSrc = e.target.result;
            addImageToPreview(imgSrc);

            // Zapisz obraz w lokalnym przechowywaniu
            const images = JSON.parse(localStorage.getItem('images')) || [];
            if (!images.includes(imgSrc)) { // Upewnij się, że obraz nie jest duplikatem
                images.push(imgSrc);
                localStorage.setItem('images', JSON.stringify(images));
            }
            document.getElementById('removeButton').style.display = 'block'; // Pokaż przycisk usuwania
        };
        reader.readAsDataURL(file);
    }
});

// Usuwanie zdjęcia
document.getElementById('removeButton').addEventListener('click', function() {
    const preview = document.getElementById('preview');
    preview.innerHTML = ''; // Wyczyść podgląd zdjęcia
    document.getElementById('fileInput').value = ''; // Wyczyść wartość inputu

    localStorage.removeItem('images'); // Usuń obrazy z lokalnego przechowywania
    this.style.display = 'none'; // Ukryj przycisk usuwania
});

// Ładowanie danych
function loadTableData() {
    const tableData = JSON.parse(localStorage.getItem('tableData')) || [];
    const tableBody = document.getElementById('tableBody');

    tableData.forEach(rowData => {
        addRowToTable(rowData);
    });
}

function loadImages() {
    const images = JSON.parse(localStorage.getItem('images')) || [];
    const preview = document.getElementById('preview');

    images.forEach(imageSrc => {
        addImageToPreview(imageSrc);
    });

    document.getElementById('removeButton').style.display = images.length ? 'block' : 'none';
}

function loadTextItems() {
    const textItems = JSON.parse(localStorage.getItem('textItems')) || [];
    const contentDiv = document.getElementById('content');

    textItems.forEach(itemText => {
        addTextItem(itemText);
    });
}

// Funkcje do dodawania danych
function addRowToTable(rowData) {
    const tableBody = document.getElementById('tableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${rowData.data}</td>
        <td>${rowData.imie}</td>
        <td>${rowData.nazwisko}</td>
        <td>${rowData.wiek}</td>
        <td><button class="deleteBtn">Usuń</button></td>
    `;

    tableBody.appendChild(newRow);
    newRow.querySelector('.deleteBtn').addEventListener('click', function() {
        newRow.remove();
        saveTableData(); // Aktualizuj dane po usunięciu
    });
}

function addImageToPreview(imageSrc) {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.maxWidth = '300px';
    img.style.margin = '5px';
    document.getElementById('preview').appendChild(img);
}

function addTextItem(text) {
    const contentDiv = document.getElementById('content');
    const newItem = document.createElement('div');
    newItem.classList.add('item');

    const itemText = document.createElement('p');
    itemText.textContent = text;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Usuń';
    deleteButton.addEventListener('click', function() {
        contentDiv.removeChild(newItem);
        saveTextItems(); // Aktualizuj dane po usunięciu
    });

    newItem.style.display = 'flex';
    newItem.style.justifyContent = 'space-between';
    newItem.style.alignItems = 'center';

    newItem.appendChild(itemText);
    newItem.appendChild(deleteButton);
    contentDiv.appendChild(newItem);
}

// Funkcje do zapisywania danych
function saveTableData() {
    const rows = document.querySelectorAll('#tableBody tr');
    const tableData = [];

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = {
            data: cells[0].innerText,
            imie: cells[1].innerText,
            nazwisko: cells[2].innerText,
            wiek: cells[3].innerText
        };
        tableData.push(rowData);
    });

    localStorage.setItem('tableData', JSON.stringify(tableData));
}

// Obsługa formularza dodawania wiersza
document.getElementById('addRowForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const data = document.getElementById('data').value;
    const imie = document.getElementById('imie').value;
    const nazwisko = document.getElementById('nazwisko').value;
    const wiek = document.getElementById('wiek').value;

    const rowData = { data, imie, nazwisko, wiek };
    addRowToTable(rowData);
    saveTableData(); // Zapisz dane po dodaniu nowego wiersza
    this.reset();
});

// Funkcje do zapisywania tekstów
function saveTextItems() {
    const items = [];
    const itemElements = document.querySelectorAll('#content .item p');
    itemElements.forEach(item => {
        items.push(item.textContent);
    });

    localStorage.setItem('textItems', JSON.stringify(items));
}
