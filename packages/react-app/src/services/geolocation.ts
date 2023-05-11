import { getDistance } from 'geolib';

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

const isWithinRadius = (
  latitude: number,
  longitude: number,
  radius: number
) => {
  return getLocation().then((position: GeolocationCoordinates | null) => {
    if (!position) {
      return false;
    }

    const distance = getDistance(
      { latitude: position.latitude, longitude: position.longitude },
      { latitude: latitude, longitude: longitude }
    );
    return distance < radius;
  });
};

const GeolocationService = {
  getLocationPermission,
  getLocation,
  isWithinRadius,
};
export default GeolocationService;
