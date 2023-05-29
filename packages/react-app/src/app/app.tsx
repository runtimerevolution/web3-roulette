import './app.module.scss';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import GiveawayDetailsPage, {
  loader as giveawayLoader,
} from '../pages/details';
import EditGiveaway from '../pages/edit';
import LoginPage from '../pages/login';
import Manage from '../pages/manage';
import AuthRoute from '../routes/AuthRoute';
import LocationEdit from '../pages/location';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<AuthRoute />}>
        <Route index element={<Manage />} />
        <Route path="edit" element={<EditGiveaway />} />
        <Route
          path="giveaways/:giveawayId"
          element={<GiveawayDetailsPage />}
          loader={giveawayLoader}
        />
        <Route
          path="location/new"
          element={<LocationEdit />}
        />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Route>
  )
);

const App = () => <RouterProvider router={router} />;

export default App;
