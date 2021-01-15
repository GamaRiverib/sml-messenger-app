import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serviceType'
})
export class ServiceTypePipe implements PipeTransform {

  private names = {
    'ON_DEMAND': 'Service on demand', 
    'SAME_DAY': 'Service same day', 
    'NEXT_DAY': 'Service next day'
  };

  transform(value: string): string {
    return this.names[value] || 'Unknown service type';
  }

}
