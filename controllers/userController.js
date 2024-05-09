const  User = require('../models/User');

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find()
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Get one user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.userId })
      .select('-__v')
      .populate('friends')
      .populate('thoughts')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Create a new user
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(500).json(err));
  },

  // Update a user by id
  updateUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
  
        // Update user with the provided body (username and email)
        user.username = req.body.username;
        user.email = req.body.email;
        return user.save();
      })
      .then(updatedUser => res.json(updatedUser))
      .catch(err => res.status(500).json(err));
  },

  // Delete a user by id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(500).json(err));
  },

  // Add a friend to user's friend list
  addFriend: async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true, runValidators: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while adding a friend.' });
    }
  },

  // Remove a friend from user's friend list
  removeFriend: async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true, runValidators: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while removing a friend.' });
    }
  }
};

module.exports = userController;
