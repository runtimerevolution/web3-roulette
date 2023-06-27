import { verifyAdmin, verifyToken } from '../../middlewares/auth.middleware';
import { User, UserRole } from '../../models/user.model';

const mockedVerifyToken = jest.mocked(verifyToken);
const mockedVerifyAdmin = jest.mocked(verifyAdmin);

const authenticated = (testFn) => {
  return async () => {
    mockedVerifyToken.mockImplementation(async (req, res, next) => {
      const user = await User.create({
        email: 'example@domain.com',
        name: 'name',
      });
      req.user = user;
      next();
    });
    mockedVerifyAdmin.mockImplementation(async (req, res) => {
      return res.status(401).json({ error: 'Invalid user role' });
    });
    await testFn();
  };
};

const notAuthenticated = (testFn) => {
  return async () => {
    mockedVerifyToken.mockImplementation(async (req, res) => {
      return res.status(401).json({ error: 'Invalid token' });
    });
    mockedVerifyAdmin.mockImplementation(async (req, res) => {
      return res.status(401).json({ error: 'Invalid user role' });
    });
    await testFn();
  };
};

const adminAuthenticated = (testFn) => {
  return async () => {
    mockedVerifyToken.mockImplementation(async (req, res, next) => {
      const user = await User.create({
        email: 'example@domain.com',
        name: 'name',
        role: UserRole.ADMIN,
      });
      req.user = user;
      next();
    });
    mockedVerifyAdmin.mockImplementation(async (req, res, next) => {
      next();
    });
    await testFn();
  };
};

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export { adminAuthenticated, authenticated, notAuthenticated, wait };
