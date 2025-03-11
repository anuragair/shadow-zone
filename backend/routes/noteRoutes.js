const express = require('express');
const router = express.Router();
const { getNotes, createNote, deleteNote } = require('../controllers/noteController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Route to get all notes
router.get('/', getNotes);

// Route to create a new note
router.post('/', createNote);

// Route to delete a note
router.delete('/:id', deleteNote);

module.exports = router; 