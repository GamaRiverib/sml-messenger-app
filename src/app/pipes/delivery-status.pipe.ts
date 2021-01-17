import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deliveryStatus',
  pure: true
})
export class DeliveryStatusPipe implements PipeTransform {

  private names = {
    CREATED: {
      short: 'Created',
      action: 'Take or reject',
      long: 'Package was registered'
    },
    QUEUED: {
      short: 'Queued',
      action: 'Take or reject',
      long: 'Package is waiting to be assigned'
    },
    IN_ORDER: {
      short: 'In order',
      action: 'Go to collect',
      long: 'Package is assigned'
    },
    COLLECTED: {
      short: 'Collected',
      action: 'Start delivery',
      long: 'Package was collected'
    },
    READY_TO_STORAGE: {
      short: 'Ready to storage',
      action: 'Take to warehouse',
      long: 'Package in storage process'
    },
    READY_TO_DELIVERY: {
      short: 'Ready to delivery',
      action: 'Go to delivery',
      long: 'Package in delivery process'
    },
    DELIVERED: {
      short: 'Delivered',
      action: 'Delivered',
      long: 'Package was delivered'
    },
    TO_STORAGE: {
      short: 'To storage',
      action: 'Take to warehouse',
      long: 'Package returns to the warehouse'
    },
    TO_NEXT_VISIT: {
      short: 'To next visit',
      action: 'Take or reject',
      long: 'Package ready to a new delivery attempt'
    },
    VISIT_DONE: {
      short: 'Visit done',
      action: 'Delivery failed',
      long: 'Destination was visited without success'
    },
    STORAGED: {
      short: 'Storaged',
      action: 'Storaged',
      long: 'Package is in the warehouse'
    },
    VISIT_CANCELED: {
      short: 'Visit canceled',
      action: 'Visit canceled',
      long: 'Visit was canceled by the customer'
    },
    DELETED: {
      short: 'Deleted',
      action: 'Deleted',
      long: 'Delivery service is eliminated'
    },
    VISIT_SUSPENDED: {
      short: 'Visit suspended',
      action: 'Visit suspended',
      long: 'Courier suspended the visit'
    },
    RETURNED: {
      short: 'Returned',
      action: 'Return to collect address',
      long: 'Package was returned'
    },
    LOST: {
      short: 'Lost',
      action: 'Lost',
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
