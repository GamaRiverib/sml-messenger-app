import { Pipe, PipeTransform } from '@angular/core';
import { KEYS } from '../app.values';

@Pipe({
  name: 'deliveryStatus',
  pure: true
})
export class DeliveryStatusPipe implements PipeTransform {

  transform(value: string, format?: string): string | null {
    if (value == null || value === '' || value !== value) {
      return null;
    }
    format = (format || 'short').toUpperCase();
    
    if (!KEYS.STATUS[value]) {
      return KEYS.STATUS.UNKNOW;
    }
    const key = KEYS.STATUS[value];
    if (!key[format]) {
      return KEYS.STATUS.UNKNOW;
    }
    return key[format];
  }

}
