// dashboard.js

// Check if user is logged in
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'signin.html';
}

// Initialize notes array from localStorage or empty array
let notes = JSON.parse(localStorage.getItem('notes') || '[]');
const user = localStorage.getItem('user');

// DOM Elements
const notesList = document.getElementById('notesList');
const addNoteForm = document.getElementById('addNoteForm');
const noteInput = document.getElementById('noteInput');
const userDisplay = document.getElementById('userDisplay');

// Display username
if (userDisplay) 
    userDisplay.textContent = `Welcome, ${user}`;
}

// Render notes
function renderNotes() {
    if (!notesList) return;
    
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-card';
        noteElement.innerHTML = `
            <p>${note.content}</p>
            <div class="note-actions">
                <span class="note-date">${new Date(note.date).toLocaleDateString()}</span>
                <button onclick="deleteNote(${index})" class="delete-btn">Delete</button>
            </div>
        `;
        notesList.appendChild(noteElement);
    });
}

// Add new note
if (addNoteForm) {
    addNoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!noteInput.value.trim()) return;

        const newNote = {
            content: noteInput.value,
            date: new Date(),
            author: user
        };

        notes.unshift(newNote);
        localStorage.setItem('notes', JSON.stringify(notes));
        noteInput.value = '';
        renderNotes();
    });
}

// Delete note
function deleteNote(index) {
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

// Sign out functionality
document.getElementById('signOutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

// Initial render
renderNotes();
