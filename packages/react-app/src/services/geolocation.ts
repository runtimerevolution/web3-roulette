import { getDistance } from 'geolib';

const RUNTIME_LATITUDE = 38.752962;
const RUNTIME_LONGITUDE = -9.1478609;

const getLocationPermission = () => {
  if (!navigator.geolocation) {
    return new Promise((resolve, _) => resolve(false));
  }
  return navigator.permissions
    .query({ name: 'geolocation' })
    .then((result) => result.state !== 'denied');
};

const getLocation = () => {
  if (!navigator.geolocation) {
    return new Promise<GeolocationCoordinates | null>((resolve, _) =>
      resolve(null)
    );
  }
  return new Promise<GeolocationCoordinates | null>((resolve, _) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (_) => resolve(null),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

const isAtTheOffice = () => {
  return getLocation().then((position: GeolocationCoordinates | null) => {
    if (!position) {
      return false;
    }

    const distance = getDistance(
      { latitude: position.latitude, longitude: position.longitude },
      { latitude: RUNTIME_LATITUDE, longitude: RUNTIME_LONGITUDE }
    );
    return distance < 500;
  });
};

const GeolocationService = {
  getLocationPermission,
  getLocation,
  isAtTheOffice,
};
export default GeolocationService;
