import { isCSR } from 'lightning/utilsPrivate';
export const DEFAULT_LOCATION = { lat: 37.790091, lng: -122.396848 };

const getCurrentPosition =
    isCSR &&
    navigator &&
    navigator.geolocation &&
    navigator.geolocation.getCurrentPosition
        ? navigator.geolocation.getCurrentPosition.bind(navigator.geolocation)
        : (success, error) => error && error();

export function getLocation() {
    return new Promise((resolve) => {
        getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => resolve(DEFAULT_LOCATION)
        );
    });
}
