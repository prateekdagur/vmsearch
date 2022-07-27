import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][appPhoneMask]',
})
export class PhoneMaskDirective {

  constructor(public ngControl: NgControl) { }

  
      @HostListener('keyup', ['$event'])

      keyup(event) {
      //console.log(event.key);
      if(event.key === 'Backspace'){
        return
      }else{
        this.onInputChange( this.ngControl.value, false);
      }
        
      }

      @HostListener('keydown.backspace', ['$event'])

      keydownBackspace(event) {
        if(event.key === 'Backspace'){
          return
        }else{
        this.onInputChange( this.ngControl.value, true);
        }
      
      }
  

   onInputChange(newVal, backspace) { 
    console.log(newVal);
      if(newVal.dialCode == "+1") {
        newVal = newVal.nationalNumber;
        //let newVal = event.replace(/\D/g, '');
        console.log(newVal.length);
       
        if (newVal.length === 0) {
        newVal = '';
        } else if (newVal.length <= 3) {
        newVal = newVal.replace(/^(\d{0,3})/, '($1)');
        this.ngControl.valueAccessor.writeValue(newVal);
        } else if (newVal.length <= 6) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
        this.ngControl.valueAccessor.writeValue(newVal);
        } else if (newVal.length <= 10) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
        this.ngControl.valueAccessor.writeValue(newVal);
        }
      
        }
    }
}
