import { Route, Routes } from 'react-router-dom';
import EditGiveaway from '../pages/edit';
import Manage from '../pages/manage';
import LoginPage from '../pages/login';
import AuthRoute from '../routes/AuthRoute';
import './app.module.scss';

const App = () => (
  <Routes>
    <Route path="/" element={<AuthRoute />}>
      <Route index element={<Manage />} />
      <Route path="edit" element={<EditGiveaway />} />
    </Route>
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);

export default App;
