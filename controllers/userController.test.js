const userController = require('./userController');

describe('userController', () => {
  let mockRequest, mockResponse;

  test('jest.fn recalls as expected', () => {
    const mock = jest.fn();
    mock('a', 'b', 'c');
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith('a', 'b', 'c');
  });

  beforeEach(() => {
    mockRequest = ({ body, params }) => {
      return {
        body,
        params
      };
    };

    mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
    };
  });

  describe.skip('POST /signin', () => {
    test('should set session data', async () => {
      const req = mockRequest({
        email: 'user1@example.com',
        password: '12345678'
      });
      const res = mockResponse();
      const data = await userController.signIn(req, res);
    });
  });

  describe.skip('getUser', () => {
    test('should return with a render page', async () => {
      const req = mockRequest({ params: { id: 14 } });
      const res = mockResponse();

      const data = await userController.getUser(req, res);
      console.log('data', data);
    });
  });
});
