document.addEventListener('DOMContentLoaded', () => {
  const noteForm = document.getElementById('note-form');
  const noteList = document.getElementById('note-list');

  const loadNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const notes = await response.json();
      renderNotes(notes);
    } catch (err) {
      console.error('Error loading notes:', err);
    }
  };

  const renderNotes = (notes) => {
    noteList.innerHTML = '';
    notes.forEach(note => {
      const noteElement = document.createElement('div');
      noteElement.classList.add('note');
      noteElement.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <p>Created at: ${new Date(note.createdAt).toLocaleString()}</p>
        <button data-id="${note.id}" class="edit-btn">Edit</button>
        <button data-id="${note.id}" class="delete-btn">Delete</button>
      `;
      noteList.appendChild(noteElement);
    });
  };

  noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      const newNote = await response.json();
      renderNotes([newNote]);
      noteForm.reset();
    } catch (err) {
      console.error('Error creating note:', err);
    }
  });

  noteList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('edit-btn')) {
      const id = e.target.dataset.id;
      try {
        const response = await fetch(`/api/notes/${id}`, {
          method: 'GET'
        });
        const note = await response.json();
        document.getElementById('title').value = note.title;
        document.getElementById('content').value = note.content;
      } catch (err) {
        console.error('Error loading note:', err);
      }
    } else if (e.target.classList.contains('delete-btn')) {
      const id = e.target.dataset.id;
      try {
        await fetch(`/api/notes/${id}`, {
          method: 'DELETE'
        });
        loadNotes();
      } catch (err) {
        console.error('Error deleting note:', err);
      }
    }
  });

  loadNotes();
});