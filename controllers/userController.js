const  User = require('../models/User');

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find()
      // .populate({
      //   path: 'thoughts',
      //   select: '-__v'
      // })
      // .populate({
      //   path: 'friends',
      //   select: '-__v'
      // })
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
      // .populate({
      //   path: 'thoughts',
      //   select: '-__v'
      // })
      // .populate({
      //   path: 'friends',
      //   select: '-__v'
      // })
      
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
        user.username = body.username;
        user.email = body.email;
        return user.save();
      })
      .then(updatedUser => res.json(updatedUser))
      .catch(err => res.status(500).json(err));
  },

  // Delete a user by id
  deleteUser({ params }, res) {
      User.findOneAndDelete({ userId: params.id })
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this id!' });
            return;
          }
          res.json(dbUserData);
        })
    .catch(err => res.json(err));
},

  // Add a friend to user's friend list
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // Remove a friend from user's friend list
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  }
};

module.exports = userController;
