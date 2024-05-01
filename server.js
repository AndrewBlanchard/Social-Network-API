const express = require('express');
const mongoose = require('mongoose');
const reactionRoutes = require('./routes/reactionRoutes');
const thoughtRoutes = require('./routes/thoughtRoutes');
const userRoutes = require('./routes/userRoutes');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use this to log mongo queries being executed
mongoose.set('debug', true);

app.use('/api/thoughts', reactionRoutes);
app.use('/api/thoughts', thoughtRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));