const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('source'));

// GET route to retrieve notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500),json({ error: 'Failed to read notes data.' });
        }
        res.json(JSON.parse(data));
    });
});

// Route to save a new note
app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(dirname, 'db/db.json'), 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read notes data' });
      }
  
      const notes = JSON.parse(data);
      const newNote = { ...req.body, id: Date.now().toString() };
      notes.push(newNote);
  
      fs.writeFile(path.join(dirname, 'db/db.json'), JSON.stringify(notes, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to save note' });
        }
        res.json(newNote);
      });
    });
  });
  
  // Route to delete a note
  app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(path.join(dirname, 'db/db.json'), 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read notes data' });
      }
  
      const notes = JSON.parse(data);
      const filteredNotes = notes.filter(note => note.id !== req.params.id);
  
      fs.writeFile(path.join(dirname, 'db/db.json'), JSON.stringify(filteredNotes, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete note' });
        }
        res.json({ id: req.params.id });
      });
    });
  });
  
  // Catch-all route to serve the index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'source/index.html'));
  });
  
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });