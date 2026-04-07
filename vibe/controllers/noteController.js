const fs = require('fs');
const path = require('path');

const notesFilePath = path.join(__dirname, '../data/notes.json');

const getNotes = (req, res) => {
  try {
    const notes = JSON.parse(fs.readFileSync(notesFilePath, 'utf8'));
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Error reading notes' });
  }
};

const createNote = (req, res) => {
  try {
    const { title, content } = req.body;
    const notes = JSON.parse(fs.readFileSync(notesFilePath, 'utf8'));
    const newNote = { id: notes.length + 1, title, content, createdAt: new Date().toISOString() };
    notes.push(newNote);
    fs.writeFileSync(notesFilePath, JSON.stringify(notes));
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: 'Error creating note' });
  }
};

const updateNote = (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const notes = JSON.parse(fs.readFileSync(notesFilePath, 'utf8'));
    const noteIndex = notes.findIndex(note => note.id === parseInt(id));
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    notes[noteIndex] = { ...notes[noteIndex], title, content };
    fs.writeFileSync(notesFilePath, JSON.stringify(notes));
    res.json(notes[noteIndex]);
  } catch (err) {
    res.status(500).json({ error: 'Error updating note' });
  }
};

const deleteNote = (req, res) => {
  try {
    const { id } = req.params;
    let notes = JSON.parse(fs.readFileSync(notesFilePath, 'utf8'));
    notes = notes.filter(note => note.id !== parseInt(id));
    fs.writeFileSync(notesFilePath, JSON.stringify(notes));
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting note' });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote
};