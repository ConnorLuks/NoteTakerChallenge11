const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "develop/source/index.html")));

const dbPath = path.join(__dirname, 'db', 'db.json');

app.get('/api/notes', (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading notes');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = {
        id: uniqid(),
        title: req.body.title,
        text: req.body.text
    };

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading notes');
            return;
        }

        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error saving note');
                return;
            }
            res.json(newNote);
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading notes');
            return;
        }

        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);

        fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error deleting note');
                return;
            }
            res.json({ id: noteId });
        });
    });
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "develop/source/notes.html"));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "develop/source/index.html"));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});


