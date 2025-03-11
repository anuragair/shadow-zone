// dashboard.js

// Check if user is logged in
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'signin.html';
}

// Get user data
const user = JSON.parse(localStorage.getItem('user'));

// DOM Elements
const notesList = document.getElementById('notesList');
const addNoteForm = document.getElementById('addNoteForm');
const noteInput = document.getElementById('noteInput');
const userDisplay = document.getElementById('userDisplay');

// Display username
if (userDisplay) {
    userDisplay.textContent = `Welcome, ${user.email || user.phone}`;
}

// API headers with authentication
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

// Fetch and render notes
async function fetchNotes() {
    try {
        const response = await fetch('http://localhost:3000/api/notes', {
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch notes');
        }

        const notes = await response.json();
        renderNotes(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        alert('Failed to load notes');
    }
}

// Render notes
function renderNotes(notes) {
    if (!notesList) return;
    
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

// Add new note
if (addNoteForm) {
    addNoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!noteInput.value.trim()) return;

        try {
            const response = await fetch('http://localhost:3000/api/notes', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    content: noteInput.value
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add note');
            }

            noteInput.value = '';
            fetchNotes(); // Refresh notes list
        } catch (error) {
            console.error('Error adding note:', error);
            alert('Failed to add note');
        }
    });
}

// Delete note
async function deleteNote(noteId) {
    try {
        const response = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Failed to delete note');
        }

        fetchNotes(); // Refresh notes list
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note');
    }
}

// Sign out functionality
document.getElementById('signOutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
});

// Initial load
fetchNotes();
