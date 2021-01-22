const path = require('path')
const express = require('express')
const xss = require('xss')
const NotesService = require('./notes-service')

const noteRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
    id: xss(note.id),
    name: xss(note.name),
    modified: note.modified,
    folderId: xss(note.folderId),
    content: xss(note.content),
    folderIdNum: note.folderIdNum
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
        const { id, name, modified, content, folderId } = req.body
        const newNote = { id, name, modified, content, folderId }
    
        for (const [key, value] of Object.entries(newNote))
          if (value == null)
            return res.status(400).json({
              error: { message: `Missing '${key}' in request body` }
            })
    
        NotesService.addNote(
          req.app.get('db'),
          newNote
        )
          .then(note => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${note.id}`))
              .json(serializeComment(note))
          })
          .catch(next)
    })

noteRouter
    .route('/:note_id')
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