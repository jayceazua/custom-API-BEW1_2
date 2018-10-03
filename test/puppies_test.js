const chai = require('chai');
const should = chai.should();
const app = require('../server.js')
const Puppy = require('../models/puppy');
chai.use(require('chai-http'));

// Sample Puppy
const samplePuppy = {
    name: "Lila",
    breed: "American Staffordshire Terrier",
    gender: "female",
    age: 3
}


// tell mocha you want to test Puppies (this string is taco)
describe('Puppies', () => {
    // dump the inputs after each test
    after(() => {
        Puppy.deleteMany({ name: 'Lila' })
        .exec((err, puppies) => {
            puppies.remove()
        })
    });

    // TEST INDEX
    it('Should index ALL puppies on / GET', (done) => {
        // use chai-http to make a request to your server
        chai.request(app)
        // send a GET request to root route
        .get('/')
        // wait for response
        .then((res) => {
            // check that the response status is = 200 (success)
            res.status.should.be.equal(200);
            // end this test and move onto the next.
            return done();
        })
        .catch((err) => {
            return done(err)
        });
    });

    // TEST CREATE
    it('Should add NEW puppy into database', (done) => {
        chai.request(app)
        .post('/puppies')
        .send(samplePuppy)
        .then((res) => {
            res.status.should.be.equal(200);
             return done();
        })
        .catch((err) => {
            return done(err)
        });
    });

    // TEST READ
    it('Should show a SINGLE puppy on /puppies/:id GET', (done) => {
        // make a sample puppy into the schema
        let puppy = new Puppy(samplePuppy);
        puppy.save().then((data) => {
            chai.request(app)
            .get(`/puppies/${data._id}`)
            .then((res) => {
                res.status.should.be.equal(200);
                return done()
            })
            .catch((err) => {
                throw err
            })
        })
        .catch((err) => {
            return done(err)
        });
    });

    // TEST UPDATE
    it('Should update a SINGLE puppy on /puppies/:id PUT', (done) => {
        let puppy = new Puppy(samplePuppy);
        puppy.save((err, data)  => {
            chai.request(app)
            .put(`/puppies/${data._id}?_method=PUT`)
            .send({'name': 'Thor', 'breed': 'Pug', 'gender': 'male', 'age': 2})
            .then((res) => {
                res.status.should.be.equal(200);
                // res.should.be.json
                return done();
            })
            .catch((err) => {
                return done(err)
            });
        });
    });

    // TEST DELETE
    it('Should delete a SINGLE puppy on /puppies/:id DELETE', (done) => {
        let puppy = new Puppy(samplePuppy);
        puppy.save((err, data) => {
            chai.request(app)
            .delete(`/puppies/${data.id}?_method=DELETE`)
            .then((res) => {
                res.status.should.be.equal(200);
                return done()
            })
            .catch((err) => {
                return done(err)
            });
        });
    }); // end of the DELETE

});
