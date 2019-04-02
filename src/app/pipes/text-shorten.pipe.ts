import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textShorten'
})
export class TextShortenPipe implements PipeTransform {

  transform(value: any, limit: number): any {
    return value.substr(0, limit);
  }

}
