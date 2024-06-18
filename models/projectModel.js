const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  template: {
    type: String,
  },
  customizationData: {
    type: {
      bgColor: {
        type: String,
        default: 'primary' // Default value for bgColor
      }
    },
    default: {} // Default empty object
  },
  timestamp: {
    type : Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
