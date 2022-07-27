
import {Pipe, PipeTransform} from '@angular/core';
import { UserService } from './shared/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
    name: 'commonDnrName'
})
export class commonPipe implements PipeTransform {

    title:any;
    constructor(private userService: UserService) { }

    transform(value: any, unit ?: any): Observable<any> {        
        return this.userService.getDnrTitle(value).pipe(
            map((result) => {
                return result;
            })
          );
          
    }

}