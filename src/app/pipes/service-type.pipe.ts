import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serviceType'
})
export class ServiceTypePipe implements PipeTransform {

  private names = {
    ON_DEMAND: {
      short: 'On demand',
      long: 'On demand service'
    }, 
    SAME_DAY: {
      short: 'Same day',
      long: 'Same day service'
    }, 
    NEXT_DAY: {
      short: 'Next day',
      long: 'Next day service'
    }
  };

  transform(value: string, format?: string): string {
    if (value == null || value === '' || value !== value) {
      return null;
    }
    if(this.names[value] === undefined) {
      return 'Unknow status';
    }
    format = format || 'short';
    return (this.names[value])[format] || 'Unknown';
  }

}
