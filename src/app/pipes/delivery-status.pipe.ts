import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deliveryStatus'
})
export class DeliveryStatusPipe implements PipeTransform {

  private names = {
    'CREATED': 'Package was registered',
    'QUEUED': 'Package is waiting to be assigned',
    'IN_ORDER': 'Package is assigned',
    'COLLECTED': 'Package was collected',
    'READY_TO_STORAGE': 'Package in storage process',
    'READY_TO_DELIVERY': 'Package in delivery process',
    'DELIVERED': 'Package was delivered',
    'TO_STORAGE': 'Package returns to the warehouse',
    'TO_NEXT_VISIT': 'Package ready to a new delivery attempt',
    'VISIT_DONE': 'Destination was visited without success',
    'STORAGED': 'Package is in the warehouse',
    'VISIT_CANCELLED': 'Visit was canceled by the customer',
    'DELETED': 'Delivery service is eliminated',
    'VISIT_SUSPENDED': 'Courier suspended the visit',
    'RETURNED': 'Package was returned',
    'LOST': 'Package is lost'
  };

  transform(value: string): string {
    return this.names[value] || 'Unknown status';
  }

}
