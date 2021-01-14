import { Address } from "./address";
import { AddressInstruction } from "./address-instruction";
import { Contact } from "./contact";
import { DeliveryHistoryItem } from "./delivery-history-item";
import { Package } from "./package";

export class Order {
  Id: number;
  CreatedAt: string;
  SourceAddress: Address;
  SourceAddressInstruction?: AddressInstruction;
  DestinationAddress: Address;
  DestinationAddressInstruction?: AddressInstruction;
  ServiceType: string;
  DeliveryStatus: string;
  Distance?: Number;
  EstimatedDeliveryTime?: Number;
  Packages: Package[];
  CustomerContact: Contact;
  DeliveryLog: DeliveryHistoryItem[];
}
