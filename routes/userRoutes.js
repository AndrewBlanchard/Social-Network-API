const router = require('express').Router();
const { User } = require('../models/User');
const { Thought } = require('../models/Thought');
const { addFriend, removeFriend } = require('../controllers/userController');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');

router.route('/').post(createUser).get(getAllUsers);
router.route('/:userId').get(getUserById).put(updateUser).delete(deleteUser);

// GET a single user by id
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
      .populate('thoughts')
      .populate('friends');
    if (!user) {
      return res.status(404).json({ message: 'No user found with this id!' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT to update a user by id
router.put('/:userId', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'No user found with this id!' });
    }
    res.json(updatedUser);
  } catch (err) {
    console.log(err); // Log the complete error object for debugging
    res.status(500).json({ message: 'Internal Server Error' }); // Generic error for now
  }
});

// DELETE to remove a user by id
router.delete('/:userId', async (req, res) => {
  try {
    const deletedUser = await User.findOneAndRemove({ _id: req.params.userId });
    if (!deletedUser) {
      return res.status(404).json({ message: 'No user found with this id!' });
    }
    // BONUS: Remove associated thoughts
    await Thought.deleteMany({ username: deletedUser.username });
    res.json({ message: 'User and associated thoughts deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', addFriend);

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', removeFriend);

module.exports = router;