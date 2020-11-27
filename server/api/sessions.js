const router = require("express").Router();
const { User, Session } = require("../db/models");

module.exports = router;

//Get all sessions
router.get("/", async (req, res, next) => {
  try {
    const allSession = await Session.findAll();
    res.json(allSession);
  } catch (err) {
    next(err);
  }
});

//Add a new session
router.post("/new", async (req, res, next) => {
  try {
    const createSession = await Session.create(req.body);
    res.json(createSession);
  } catch (error) {
    next(error);
  }
});

//Save a session
router.put("/:id", async (req, res, next) => {
  try {
    const updatedSession = await Session.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    res.json(updatedSession);
  } catch (error) {
    next(error);
  }
});

//Delete a session
router.delete("/:id", async (req, res, next) => {
  try {
    const deleteSession = await Session.destroy({
      where: { id: req.params.id },
    });
    res.json(deleteSession);
  } catch (error) {
    next(error);
  }
});
