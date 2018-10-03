const chai = require('chai');
const should = chai.should();
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
    // dump the inputs
    after(() => {
        Puppy.deleteMany({ name: 'Lila' })
        .exec((err, puppies) => {
            console.log(puppies)
            puppies.remove()
        })
    });

    // make taco name for the test
    it('Should index ALL puppies on / GET', (done) => {
        // use chai-http to make a request to your server
        chai.request('localhost:3000')
            // send a GET request to root route
            .get('/')
            // wait for response
            .end((err, res) => {
                // check that the response status is = 200 (success)
                res.should.have.status(200);
                // end this test and move onto the next.
                done();
            });
    });

    // TEST CREATE
    it('Should add new puppy into database', (done) => {
        let puppy = new Puppy(samplePuppy);
        puppy.save((err, data) => {
            chai.request('localhost:3000')
            .post('/puppies')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
    });

    // TEST SHOW
    it('Should show a SINGLE puppy on /puppies/:id GET', (done) => {
        // make a sample puppy into the schema
        let puppy = new Puppy(samplePuppy);
        puppy.save((err, data) => {
            chai.request('localhost:3000')
            .get(`/puppies/${data._id}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });

    });

    // TEST EDIT
    // TEST UPDATE
    // TEST DELETE



});