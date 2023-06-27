import { verifyToken } from '../../middlewares/auth.middleware';

const mockedVerifyToken = jest.mocked(verifyToken);

const authenticated = (testFn) => {
  return async () => {
    mockedVerifyToken.mockImplementation(async (req, res, next) => next());
    await testFn();
  };
};

const notAuthenticated = (testFn) => {
  return async () => {
    mockedVerifyToken.mockImplementation(async (req, res) => {
      return res.status(401).json({ error: 'Invalid token' });
    });
    await testFn();
  };
};

export { authenticated, notAuthenticated };
