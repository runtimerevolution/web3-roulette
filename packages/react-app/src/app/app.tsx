import { Route, Routes } from 'react-router-dom';
import EditGiveaway from '../pages/edit';
import Manage from '../pages/manage';
import LoginPage from '../pages/login';
import AuthRoute from '../routes/AuthRoute';
import GiveawayDetailsPage from '../pages/details';
import { loader as giveawayLoader } from '../pages/details';
import './app.module.scss';

const App = () => (
  <Routes>
    <Route path="/" element={<AuthRoute />}>
      <Route index element={<Manage />} />
      <Route path="edit" element={<EditGiveaway />} />
      <Route
        path="giveaways/:giveawayId"
        element={<GiveawayDetailsPage />}
        loader={giveawayLoader}
      />
    </Route>
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);

export default App;
