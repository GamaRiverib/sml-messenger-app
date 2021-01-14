import { AddressDto } from "./address-dto";

export class OrderDto {
  Id: number;
  CreatedAt: string;
  SourceAddress: AddressDto;
  DestinationAddress: AddressDto;
  ServiceType: string;
  DeliveryStatus: string;
  Distance?: Number;
  EstimatedDeliveryTime?: Number;
}
