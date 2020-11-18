const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
  fristName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  petName: {
    type: String,
    required: true
  },
  service: {
    type: String
  },
  date: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Reservation', reservationSchema)
