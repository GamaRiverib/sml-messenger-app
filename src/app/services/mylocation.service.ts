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
      console.log('Using test position');
      if (err && err.code && err.code === 1) {
        latlon = new LatLonSpherical(27.495495276788983, -109.96622502330013);
      }
    }
    return latlon;
  }

  async distanceFromMyPosition(destination: AddressDto | Address): Promise<{ distance: number, time: number }> {
    const myPosition = await this.getMyCurrentPosition();
    if (!myPosition) {
      return { distance: 0, time: 0 };
    }
    const destinationPoint = new LatLonSpherical(destination.latitude, destination.longitude);
    let distance1 = 0;
    let distance2 = 0;
    const point1 = new LatLonSpherical(myPosition.lat, destinationPoint.lon);
    const point2 = new LatLonSpherical(destinationPoint.lat, myPosition.lon);

    distance1 += myPosition.distanceTo(point1);
    distance1 += point1.distanceTo(destinationPoint);
    distance1 = Math.floor(distance1) / 1000;

    distance2 += myPosition.distanceTo(point2);
    distance2 += point2.distanceTo(destinationPoint);
    distance2 = Math.floor(distance2) / 1000;

    const distance = (distance1 + distance2) / 2
    const speed = this.data.getSpeed();
    const factor = 60 / speed;
    const pickupDelay = this.data.getPickupDelay();
    const time = Math.ceil(distance * factor + pickupDelay);

    return { distance: distance1, time };
  }

  async calculateDeliveryDistance(source: AddressDto | Address, destination: AddressDto | Address): Promise<{ distance: number, time: number }> {
    const pickup = new LatLonSpherical(source.latitude, source.longitude);
    const dropoff = new LatLonSpherical(destination.latitude, destination.longitude);
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

  async deliveryDistanceFromMyPosition(source: AddressDto | Address, destination: AddressDto | Address): Promise<{ distance: number, time: number }> {
    const pickup = new LatLonSpherical(source.latitude, source.longitude);
    const dropoff = new LatLonSpherical(destination.latitude, destination.longitude);
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
