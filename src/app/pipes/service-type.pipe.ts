import { Pipe, PipeTransform } from '@angular/core';
import { KEYS } from '../app.values';

@Pipe({
  name: 'serviceType'
})
export class ServiceTypePipe implements PipeTransform {

  transform(value: string, format?: string): string {
    if (value == null || value === '' || value !== value) {
      return null;
    }
    format = (format || 'short').toUpperCase();
    
    if (!KEYS.SERVICE_TYPE[format]) {
      return KEYS.SERVICE_TYPE.UNKNOW;
    }
    const key = KEYS.SERVICE_TYPE[format];
    if (!key[value]) {
      return KEYS.SERVICE_TYPE.UNKNOW;
    }
    return key[value];
  }

}
