const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const should = chai.should();
const expect = chai.expect;
const userController = require('../controllers/userController');
const BASE_URL = 'http://localhost:3000';

describe('userController', () => {
    describe('signInPage should render a page', () => {
        it('should be a function', () => {
            expect(typeof userController.signInPage).equal('function');
        });

        it('should return a render page', done => {
            chai
                .request(BASE_URL)
                .get('/')
                .end((err, res) => {
                    should.not.exist(err);
                    expect(res).to.redirectTo(`${BASE_URL}/signin`);
                    done();
                });
        });
    });
});