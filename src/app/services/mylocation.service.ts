import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { AddressDto } from '../model/address-dto';
import { Address } from '../model/address';
import { DataService } from './data.service';
import LatLonSpherical from './latlonspherical';

@Injectable({
  providedIn: 'root'
})
export class MylocationService {

  constructor(private geolocation: Geolocation, private data: DataService) {

  }

  async getMyCurrentPosition(highAccuracy?: boolean): Promise<LatLonSpherical> {
    highAccuracy = highAccuracy || false;
    let latlon: LatLonSpherical | null = null;
    try {
      const geoposition: Geoposition = await this.geolocation.getCurrentPosition({
        maximumAge: 5000,
        timeout: 5000,
        enableHighAccuracy: highAccuracy
      });
      const lat = geoposition.coords.latitude;
      const lon = geoposition.coords.longitude;
      latlon = new LatLonSpherical(lat, lon);
    } catch (err) {
      console.log(err);
    }
    return latlon;
  }

  async calculateDistance(source: AddressDto | Address, destination: AddressDto | Address): Promise<{ distance: number, time: number }> {
    const pickup = new LatLonSpherical(source.Latitude, source.Longitude);
    const dropoff = new LatLonSpherical(destination.Latitude, destination.Longitude);
    let distance = 0;
    const point2 = new LatLonSpherical(pickup.lat, dropoff.lon);
    distance += pickup.distanceTo(point2);
    distance += point2.distanceTo(dropoff);
    distance = Math.floor(distance) / 1000;

    const speed = this.data.getSpeed();
    const factor = 60 / speed;
    const pickupDelay = this.data.getPickupDelay();
    const time = Math.ceil(distance * factor + pickupDelay);

    return { distance, time };
  }

  async calculateRoute(source: AddressDto | Address, destination: AddressDto | Address): Promise<{ distance: number, time: number }> {
    const pickup = new LatLonSpherical(source.Latitude, source.Longitude);
    const dropoff = new LatLonSpherical(destination.Latitude, destination.Longitude);
    const myPosition = await this.getMyCurrentPosition();
    let distance = 0;
    if (myPosition !== null) {
      const point1 = new LatLonSpherical(myPosition.lat, pickup.lon);
      distance += myPosition.distanceTo(point1);
      distance += point1.distanceTo(pickup);
    }
    const point2 = new LatLonSpherical(pickup.lat, dropoff.lon);
    distance += pickup.distanceTo(point2);
    distance += point2.distanceTo(dropoff);

    distance = Math.floor(distance) / 1000;

    const speed = this.data.getSpeed();
    const factor = 60 / speed;
    const pickupDelay = this.data.getPickupDelay();
    const time = Math.ceil(distance * factor + pickupDelay);

    return { distance, time };
  }
}
