// import styles from './app.module.scss';

import { Route, Routes } from 'react-router-dom';
import Manage from '../pages/manage';
import AuthRoute from '../routes/AuthRoute';
import EditGiveaway from '../pages/edit';

const App = () => (
  <Routes>
    
    <Route path="/" element={<AuthRoute />}>
      <Route index element={<Manage />} />
      <Route path="edit" element={<EditGiveaway />} />
    </Route>
  </Routes>
);

export default App;
