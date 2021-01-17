import { AddressDto } from "./address-dto";

export class OrderDto {
  id: number;
  createdAt: string;
  sourceAddress: AddressDto;
  destinationAddress: AddressDto;
  serviceType: string;
  deliveryStatus: string;
  distance?: Number;
  estimatedDeliveryTime?: Number;
}
