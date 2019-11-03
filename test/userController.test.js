const chai = require('chai');
const chaiHTTP = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const userController = require('../controllers/userController');
const server = require('../app');
const BASE_URL = 'http://127.0.0.1:3000';

chai.use(chaiHTTP);

describe('userController', () => {
  describe('signInPage should render a page', () => {
    it('should be a function', () => {
      expect(typeof userController.signInPage).equal('function');
    });

    it('should return a render page', done => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          should.not.exist(err);
          expect(res).to.redirectTo(`${BASE_URL}/signin`);
          done();
        });
    });
  });
});
