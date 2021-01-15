import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deliveryStatus',
  pure: true
})
export class DeliveryStatusPipe implements PipeTransform {

  private names = {
    CREATED: {
      short: 'Created',
      long: 'Package was registered'
    },
    QUEUED: {
      short: 'Queued',
      long: 'Package is waiting to be assigned'
    },
    IN_ORDER: {
      short: 'In order',
      long: 'Package is assigned'
    },
    COLLECTED: {
      short: 'Collected',
      long: 'Package was collected'
    },
    READY_TO_STORAGE: {
      short: 'Ready to storage',
      long: 'Package in storage process'
    },
    READY_TO_DELIVERY: {
      short: 'Ready to delivery',
      long: 'Package in delivery process'
    },
    DELIVERED: {
      short: 'Delivered',
      long: 'Package was delivered'
    },
    TO_STORAGE: {
      short: 'To storage',
      long: 'Package returns to the warehouse'
    },
    TO_NEXT_VISIT: {
      short: 'To next visit',
      long: 'Package ready to a new delivery attempt'
    },
    VISIT_DONE: {
      short: 'Visit done',
      long: 'Destination was visited without success'
    },
    STORAGED: {
      short: 'Storaged',
      long: 'Package is in the warehouse'
    },
    VISIT_CANCELLED: {
      short: 'Visit cancelled',
      long: 'Visit was canceled by the customer'
    },
    DELETED: {
      short: 'Deleted',
      long: 'Delivery service is eliminated'
    },
    VISIT_SUSPENDED: {
      short: 'Visit suspended',
      long: 'Courier suspended the visit'
    },
    RETURNED: {
      short: 'Returned',
      long: 'Package was returned'
    },
    LOST: {
      short: 'Lost',
      long: 'Package is lost'
    }
  };

  transform(value: string, format?: string): string | null {
    if (value == null || value === '' || value !== value) {
      return null;
    }
    if(this.names[value] === undefined) {
      return 'Unknow status';
    }
    format = format || 'short';
    return (this.names[value])[format] || 'Unknown status';
  }

}
