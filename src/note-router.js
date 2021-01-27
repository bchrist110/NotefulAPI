const path = require('path')
const express = require('express')
const xss = require('xss')
const NotesService = require('./notes-service')

const noteRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
    id: note.id,
    name: note.name,
    modified: note.modified,
    content: note.content,
    folderid: note.folderid
})

noteRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        NotesService.getAllNotes(knexInstance)
          .then(notes => {
            res.json(notes.map(serializeNote))
          })
          .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const { name, content, folderid, modified } = req.body
        const newNote = { name, content, folderid }
    
        for (const [key, value] of Object.entries(newNote))
          if (value == null)
            return res.status(400).json({
              error: { message: `Missing '${key}' in request body` }
            })
        console.log(newNote)
        newNote.folderid = Number(folderid)
        if(modified) {
          newNote.modified = modified
        }

        NotesService.addNote(
          knexInstance,
          newNote
        )
          .then(note => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${note.id}`))
              .json(serializeNote(note))
          })
          .catch(next)
    })

noteRouter
    .route('/:id')
    .all((req, res, next) => {
      NotesService.getById(req.app.get('db'), req.params.id)
      .then(note => {
        if (!note) {
            return res.status(404).json({
                error: {message: `Note doesn't exist`}
            })
        }
        res.note = note
        next()
      })
      .catch(next)
        // res.json(serializeNote(res.note))
    })
    .get((req, res, next) => {
      res.json(serializeNote(res.note))
    })    
    .delete((req, res, next) => {
        NotesService.deleteNote(
          req.app.get('db'),
          req.params.id
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
      })

module.exports = noteRouter