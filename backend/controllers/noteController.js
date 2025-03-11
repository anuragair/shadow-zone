const db = require('../config/db');

const getNotes = async (req, res) => {
    try {
        const [notes] = await db.query(
            'SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(notes);
    } catch (error) {
        console.error('Error getting notes:', error);
        res.status(500).json({ message: 'Error retrieving notes' });
    }
};

const createNote = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const [result] = await db.query(
            'INSERT INTO notes (content, user_id) VALUES (?, ?)',
            [content, req.user.id]
        );

        const [newNote] = await db.query(
            'SELECT * FROM notes WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(newNote[0]);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ message: 'Error creating note' });
    }
};

const deleteNote = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM notes WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Error deleting note' });
    }
};

module.exports = {
    getNotes,
    createNote,
    deleteNote
}; 