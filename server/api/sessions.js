const router = require('express').Router();
const { User, Session } = require('../db/models');

module.exports = router;

//Get all sessions
router.post('/:userId', async (req, res, next) => {
  try {
    const allSession = await Session.findOrCreate({
      where: { userId: req.params.userId },
    });
    res.json(allSession);
  } catch (err) {
    next(err);
  }
});

//Add a new session
router.post('/new', async (req, res, next) => {
  try {
    const createSession = await Session.create(req.body);
    res.json(createSession);
  } catch (error) {
    next(error);
  }
});

//Save a session
router.put('/:userId', async (req, res, next) => {
  console.log('put request req body >>>> ', req.body);
  try {
    // const sessionUser = await Session.findOne({
    //   where: { userId: req.params.userId },
    // });
    const [numOfAffected, updatedSession] = await Session.update(
      {
        canvas: req.body.canvas,
      },
      {
        where: { userId: req.params.userId },
      }
    );
    console.log('put request req body >>>> ', updatedSession);
    res.json(updatedSession);
  } catch (error) {
    next(error);
  }
});

//Delete a session
router.delete('/:id', async (req, res, next) => {
  try {
    const deleteSession = await Session.destroy({
      where: { id: req.params.id },
    });
    res.json(deleteSession);
  } catch (error) {
    next(error);
  }
});
