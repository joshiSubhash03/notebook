const Notes = require("../models/notesModel");

// CREATE A NOTE
const createNote = async (req, res) => {
  const note = await Notes.create({
    user_id: req.body.user_id,
    notes: req.body.notes,
  });

  return res.status(200).json(note);
};

//GET NOTES

const getNotes = async (req, res) => {
  const note = await Notes.find({ user_id: req.body.user_id });

  return res.status(200).json(note);
};

//UPDATe NOTE

const updateNote = async (req, res) => {
  const note = await Notes.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }
  );

  return res.status(200).json(note);
};

// DELETE NOTE
const deleteNote = async (req, res) => {
  await Notes.findByIdAndDelete({ _id: req.params.id });

  return res.status(200).json("Note has been deleted");
};

module.exports = { createNote, getNotes, updateNote, deleteNote };
