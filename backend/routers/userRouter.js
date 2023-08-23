const router = require("express").Router();

const {
  signUP,
  loginUser,
  forgotPassword,
  changePassword,
  logout,
} = require("../controllers/userController");
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");

router.post("/signup", signUP);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword);
router.post("/changepassword", changePassword);
router.post("/logout", logout);

router.post("/createnote", createNote);
router.get("/getnotes", getNotes);
router.put("/updatenote/:id", updateNote);
router.delete("/deletenote/:id", deleteNote);

module.exports = router;
