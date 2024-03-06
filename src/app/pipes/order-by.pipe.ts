import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: any[], field: string, reverse: boolean = false): any[] {
    if (!Array.isArray(array) || !field) {
      return array;
    }

    const sortedArray = array.sort((a, b) => {
      const x = a[field];
      const y = b[field];

      if (typeof x === 'string' && typeof y === 'string') {
        return x.localeCompare(y);
      }

      return x - y;
    });

    return reverse ? sortedArray.reverse() : sortedArray;
  }

}
