import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import GiveawayDetailsPage, {
  loader as giveawayLoader,
} from '../pages/details';
import EditGiveaway from '../pages/edit';
import LoginPage from '../pages/login';
import Manage from '../pages/manage';
import ParticipantsManagerPage, {
  loader as participantsLoader,
} from '../pages/participants';
import LocationEdit from '../pages/location';
import AuthenticationProvider from '../components/login/AuthenticationProvider';
import AuthRoute from '../routes/AuthRoute';
import './app.module.scss';
import RootBoundary from '../routes/RootBoundary';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route
        path="/"
        element={
          <AuthenticationProvider>
            <AuthRoute />
          </AuthenticationProvider>
        }
        errorElement={<RootBoundary />}
      >
        <Route index element={<Manage />} />
        <Route path="giveawaysFront/new" element={<EditGiveaway />} />
        <Route
          path="giveawaysFront/:giveawayId"
          element={<GiveawayDetailsPage />}
          loader={giveawayLoader}
          
        />
        <Route path="giveawaysFront/:giveawayId/edit" element={<EditGiveaway />} />
        <Route
          path="giveawaysFront/:giveawayId/participants"
          element={<ParticipantsManagerPage />}
          loader={participantsLoader}
        />
        <Route path="locationsFront/new" element={<LocationEdit />} />
      </Route>
      <Route
        path="/login"
        element={
          <AuthenticationProvider>
            <LoginPage />
          </AuthenticationProvider>
        }
      />
    </Route>
  )
);
const App = () => <RouterProvider router={router} />;

export default App;
