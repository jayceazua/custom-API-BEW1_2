const express = require('express');
const router = express.Router();
const Puppy = require('../models/puppy');

// INDEX
router.get('', (req, res) => {
    Puppy.find({})
    .then((puppies) => {
        res.json({puppies})
    })
    .catch((err) => {
        throw err.message
    });
});

// CREATE
router.post('', (req, res) => {
    const puppy = new Puppy(req.body)
    // const puppy = Puppy.create(req.body)
    puppy.save(req.body)
    .then((puppy) => {
        res.json({puppy})
    })
    .catch((err) => {
        throw err.message
    });
});

// READ
router.get('/:id', (req, res) => {
    Puppy.findById(req.params.id)
    .then((puppy) => {
        res.json({puppy})
    })
    .catch((err) => {
        throw err.message
    });
});

// UPDATE
router.put('/:id', (req, res) => {
    Puppy.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        breed: req.body.breed,
        gender: req.body.gender,
        age: req.body.age

    }).then((puppy) => {
        res.json({puppy})
    }).catch((err) => {
        console.log(err.message);
    })

});

// DELETE
router.delete('/:id', (req, res) => {
    Puppy.findByIdAndDelete(req.params._id)
    .then(() => {
        res.json('Successfully Deleted.')
    })
    .catch((err) => {
        throw err.message
    })
});

module.exports = router;
