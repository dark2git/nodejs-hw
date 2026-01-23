//src/routes/notesRoutes.js;

import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
  getNotesByCategory,
} from '../controllers/notesController.js';
import {
  createNoteSchema,
  categoryParamSchema,
  noteIdSchema,
  updateNoteSchema,
  getAllNotesSchema,
} from '../validations/notesValidation.js';

const router = Router();

router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);
router.post('/notes', celebrate(createNoteSchema), createNote);

// category route MUST be before :noteId to avoid conflicts
router.get(
  '/notes/category/:category',
  celebrate(categoryParamSchema),
  getNotesByCategory,
);

// routes that expect an id
router.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);
router.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);
router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

export default router;
