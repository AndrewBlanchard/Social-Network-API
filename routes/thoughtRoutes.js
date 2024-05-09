const router = require('express').Router();
const { Thought, Reaction } = require('../models/Thought');
const { User } = require('../models/User');
const reactionController = require('../controllers/reactionController');

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single thought by id
router.get('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId });
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new thought
router.post('/', async (req, res) => {
  try {
    console.log('Creating new thought:', req.body);
    const newThought = await Thought.create(req.body);
    console.log('New thought created:', newThought);

    if (User) {
      console.log('Updating user with thought ID:', newThought._id);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: newThought._id } },
        { new: true }
      )
        .catch(err => {
          console.error('Error updating user:', err);
          throw err;
        });

      if (!user) {
        console.log('No user found with ID:', req.body.userId);
        return res.status(404).json({ message: 'No user found with this id!' });
      }

      console.log('User updated successfully:', user);
    } else {
      console.error('User model is undefined');
    }

    res.json(newThought);
  } catch (err) {
    console.error('Error creating thought:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// POST a new reaction to a thought
router.post('/:thoughtId/reactions', reactionController.addReaction);

// PUT to update a thought by id
router.put('/:thoughtId', async (req, res) => {
  try {
    const updatedThought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedThought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }
    res.json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to remove a thought by id
router.delete('/:thoughtId', async (req, res) => {
  try {
    console.log('Deleting thought with ID:', req.params.thoughtId);
    const deletedThought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
    console.log('Deleted thought:', deletedThought);
    if (!deletedThought) {
      console.log('No thought found with ID:', req.params.thoughtId);
      return res.status(404).json({ message: 'No thought found with this id!' });
    }
    if (User) {
      console.log('Updating user thoughts');
      const updatedUser = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
      console.log('Updated user:', updatedUser);
    } else {
      console.error('User model is undefined');
    }
    res.json({ message: 'Thought successfully deleted!' });
  } catch (err) {
    console.error('Error deleting thought:', err);
    res.status(500).json({ message: 'An error occurred while deleting the thought.' });
  }
});


module.exports = router;