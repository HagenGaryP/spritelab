const router = require('express').Router();
const { User, Session } = require('../db/models');

module.exports = router;

//Get all sessions
router.get('/:userId', async (req, res, next) => {
  try {
    const session = await Session.findOne({
      where: {
        userId: req.params.userId,
      },
    });
    res.json(session);
  } catch (err) {
    next(err);
  }
});

router.post('/:userId', async (req, res, next) => {
  try {
    const session = await Session.create(req.body, {
      where: { userId: req.params.userId },
    });
    res.json(session);
  } catch (err) {
    next(err);
  }
});

//Add a new session
router.post('/new', async (req, res, next) => {
  console.log('API post route, req.body = ', req.body);
  try {
    const createSession = await Session.create(req.body);
    res.json(createSession);
  } catch (error) {
    next(error);
  }
});

//Save a session
router.put('/:id', async (req, res, next) => {
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
