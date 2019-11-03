const userController = require('./userController');

describe('userController', () => {
  describe('signInPage should render a page', () => {
    // expect(userController.signInPage).toBe('function')
    it('should be a function', () => {
      expect(typeof userController.signInPage).toEqual('function');
    });
  });
});
