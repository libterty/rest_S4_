/* eslint-disable no-undef */
const chai = require('chai');
const chaiHTTP = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const userController = require('../controllers/userController');
const server = require('../app');
const BASE_URL = 'http://127.0.0.1:3000';
const sinon = require('sinon');

chai.use(chaiHTTP);

describe('userController', () => {
  let mockResponse;
  let mockRequest;

  beforeEach(() => {
    mockResponse = () => {
      const res = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      return res;
    };

    mockRequest = body => ({
      body
    });
  });

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

  describe('signIn function', () => {
    it('should be a function', () => {
      expect(typeof userController.signIn).equal('function');
    });
    it('should return without err', async () => {
      const req = mockRequest({
        name: 'user1@example.com',
        password: '12345678'
      });
      const res = mockResponse();
    });
  });
});
