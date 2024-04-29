const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const reactionSchema = new Schema(

);

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
  });
  
  const Thought = model('Thought', thoughtSchema);
  
  module.exports = Thought;