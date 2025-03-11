document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/frontend/signin.html';
        return;
    }

    const noteForm = document.getElementById('noteForm');
    const noteContent = document.getElementById('noteContent');
    const notesList = document.getElementById('notesList');
    const logoutBtn = document.getElementById('logoutBtn');

    // Load notes when page loads
    loadNotes();

    // Add note form submission handler
    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = noteContent.value.trim();
        if (!content) return;

        try {
            const response = await fetch('http://localhost:3000/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) throw new Error('Failed to create note');

            noteContent.value = '';
            await loadNotes(); // Reload notes after creating new one
        } catch (error) {
            console.error('Error creating note:', error);
            alert('Failed to create note');
        }
    });

    // Function to load notes
    async function loadNotes() {
        try {
            const response = await fetch('http://localhost:3000/api/notes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch notes');

            const notes = await response.json();
            displayNotes(notes);
        } catch (error) {
            console.error('Error loading notes:', error);
            alert('Failed to load notes');
        }
    }

    // Function to display notes
    function displayNotes(notes) {
        notesList.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = `
                <p>${note.content}</p>
                <button onclick="deleteNote(${note.id})" class="delete-btn">Delete</button>
            `;
            notesList.appendChild(noteElement);
        });
    }

    // Function to delete note
    window.deleteNote = async (noteId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete note');

            await loadNotes(); // Reload notes after deletion
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Failed to delete note');
        }
    };

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/frontend/signin.html';
    });
}); 