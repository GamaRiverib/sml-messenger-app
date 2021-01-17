import { Address } from "./address";
import { AddressInstruction } from "./address-instruction";
import { Contact } from "./contact";
import { DeliveryHistoryItem } from "./delivery-history-item";
import { Package } from "./package";

export class Order {
  id: number;
  createdAt: string;
  sourceAddress: Address;
  sourceAddressInstruction?: AddressInstruction;
  destinationAddress: Address;
  destinationAddressInstruction?: AddressInstruction;
  serviceType: string;
  deliveryStatus: string;
  distance?: Number;
  estimatedDeliveryTime?: Number;
  packages: Package[];
  customerContact: Contact;
  deliveryLog: DeliveryHistoryItem[];
}
