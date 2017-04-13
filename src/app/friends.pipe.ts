import { Pipe, PipeTransform } from '@angular/core';
import { User } from './user.model';

@Pipe({
  name: 'friends'
})
export class FriendsPipe implements PipeTransform {

  transform(input) {
    console.log(input);
    var output = [];
    for(var i=0; i< input.length; i++){
      if(input[i].friends !== null) {
        output.push(input.i);
      }
      // console.log(output);
      return output;
    }
  }
}
