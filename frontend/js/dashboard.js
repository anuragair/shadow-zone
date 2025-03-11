// dashboard.js

import config from './config.js';

// Check if user is authenticated
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/signin.html';
}

const addNoteForm = document.getElementById('addNoteForm');
const notesList = document.getElementById('notesList');
const signOutBtn = document.getElementById('signOutBtn');
const userDisplay = document.getElementById('userDisplay');

// Display welcome message
if (userDisplay) {
    userDisplay.textContent = 'Welcome to Shadow Zone';
}

// Load notes
async function loadNotes() {
    try {
        const response = await fetch(`${config.API_URL}/notes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load notes');
        }

        const notes = await response.json();
        displayNotes(notes);
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

// Display notes
function displayNotes(notes) {
    notesList.innerHTML = '';
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-card';
        noteElement.innerHTML = `
            <p>${note.content}</p>
            <div class="note-actions">
                <span class="note-date">${new Date(note.created_at).toLocaleDateString()}</span>
                <button onclick="deleteNote(${note.id})" class="delete-btn">Delete</button>
            </div>
        `;
        notesList.appendChild(noteElement);
    });
}

// Add note
addNoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('noteInput').value;

    try {
        const response = await fetch(`${config.API_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            throw new Error('Failed to add note');
        }

        document.getElementById('noteInput').value = '';
        loadNotes();
    } catch (error) {
        console.error('Error adding note:', error);
    }
});

// Delete note
window.deleteNote = async (noteId) => {
    try {
        const response = await fetch(`${config.API_URL}/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete note');
        }

        loadNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
    }
};

// Sign out
signOutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/signin.html';
});

// Load notes when page loads
loadNotes();
