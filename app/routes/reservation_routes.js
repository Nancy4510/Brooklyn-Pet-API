const express = require('express')
const passport = require('passport')
const Reservation = require('../models/reservation')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// CREATE
// POST /reservations
router.post('/reservations', requireToken, (req, res, next) => {
  req.body.reservation.owner = req.user.id
  Reservation.create(req.body.reservation)
    .then(reservation => {
      res.status(201).json({ reservation: reservation.toObject() })
    })
    .catch(next)
})

// UPDATE
// PATCH /reservations/
router.patch('/reservations/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.reservation.owner
  Reservation.findById(req.params.id)
    .then(handle404)
    .then(reservation => {
      requireOwnership(req, reservation)
      return reservation.updateOne(req.body.reservation)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// SHOW
// GET /reservations/
router.get('/reservations/:id', requireToken, (req, res, next) => {
  Reservation.findById(req.params.id)
    .then(handle404)
    .then(reservation => res.status(200).json({ reservation: reservation.toObject() }))
    .catch(next)
})

// INDEX
// GET /reservations
router.get('/reservations', (req, res, next) => {
  Reservation.find()
    .populate('owner')
    .then(reservations => {
      return reservations.map(reservation => reservation.toObject())
    })
    .then(reservations => res.status(200).json({ reservations: reservations }))
    .catch(next)
})

// DESTROY
// DELETE /reservations/
router.delete('/reservations/:id', requireToken, (req, res, next) => {
  Reservation.findById(req.params.id)
    .then(handle404)
    .then(reservation => {
      requireOwnership(req, reservation)
      reservation.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
