var express = require('express')
	, morgan = require('morgan')
	, bodyParser = require('body-parser')
	, port = process.env.PORT || 8080;

var app = express();

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());

/*
 * Note has three parts: id, title, and body
 * Format: { id: 1, title: "First note!", body: "War is an ugly thing, but not the ugliest of things..." }
 * 
 * Methods:
 *	/notes
 *		GET - return array of all notes
 *		POST - create new note
 *	/notes/:id
 *		GET - return individual note
 *		PUT - change the title or body of the note
 *		DELETE - delete the note
 */

var notes = [ { id: 1, title: "First note!", body: "War is an ugly thing, but not the ugliest of things..." } ]
	, currentID = 2;

app.get('/notes', function(req, res) {
	res.json(notes);
});

app.post('/notes', function(req, res) {
	var newNote = {};

	newNote.id = currentID;
	currentID++;
	newNote.title = req.body.title;
	newNote.body = req.body.body;

	notes.push(newNote);

	res.json(newNote);
});

app.get('/notes/:id', function(req, res) {
	var returnNote = {};

	for (var i = 0; i < notes.length; i += 1) {
		var note = notes[i];
		if (note.id == req.params.id)
			return res.json(note);
	}

	res.json(returnNote);
});

app.put('/notes/:id', function(req, res) {

	for (var i = 0; i < notes.length; i += 1) {
		var note = notes[i];
		if (note.id == req.params.id) {
			note.title = req.body.title;
			note.body = req.body.body;
		}
	}

	res.send();
});

app.delete('/notes/:id', function(req, res) {
	for (var i = 0; i < notes.length; i += 1) {
		var note = notes[i];
		if (note.id == req.params.id)
			notes.slice(i, 1);
	}

	res.statusCode = 204;
	res.send();
});

app.listen(port);

console.log('listening on', port);
