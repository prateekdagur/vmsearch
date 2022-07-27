import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-subscription',
  templateUrl: './admin-subscription.component.html',
  styleUrls: ['./admin-subscription.component.scss'],
})
export class AdminSubscriptionComponent implements OnInit {
  productForm!: FormGroup;
  isSubmit: boolean = false;
  getSubscription: any;
  getbenefits: any = [];
  setvarforTable: boolean = false;
  setvarforForm: boolean = true;
  displayStyle = 'none';
  message = '';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private httpClientModule: HttpClientModule,
    private router: Router
  ) {
    // this.productForm = this.fb.group({
    //   title: new FormControl('', Validators.required),
    //   month: new FormControl('', Validators.required),
    //   price: new FormControl('', Validators.required),
    //   benefit_title: new FormControl('', Validators.required),
    //   benefits: this.fb.array([]),
    // });
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      title: new FormControl('', Validators.required),
      month: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      benefit_title: new FormControl('', Validators.required),
      benefits: this.fb.array([]),
    });
  }
  get pForm() {
    return this.productForm;
  }
  get personal() {
		return this.productForm.controls;
	}
  benefits(): FormArray {
    return this.productForm.get('benefits') as FormArray;
  }

  newBenefit(): FormGroup {
    return this.fb.group({
      benefit: '',
    });
  }

  addBenefit() {
    this.benefits().push(this.newBenefit());
  }

  removeBenefit(i: number) {
    this.benefits().removeAt(i);
  }

  onSubmit() {
    this.userService.createAdminSubscription(this.productForm.value).subscribe(
      (response) => {
        if (response) {
          this.productForm.reset();
           Swal.fire(response['msg']);
           this.router.navigate(['/adminlist-subscription']);
        }
        console.log(response, 'kkkkkkkkkkkk');
      },
      (err: any) => {
        this.displayStyle = 'block';
        this.message = err.error.msg;
        Swal.fire(this.message);
      }
    );
  }
  //console.log(JSON.stringify(this.productForm.value.benefits), 'kkkkkkkkkkkk1111111111');
//     let params:any = {		
// 			'title':this.productForm.value.title,			
// 			'month':this.productForm.value.month,			
// 			'price':this.productForm.value.price,	
// 			'benefit_title':this.productForm.value.benefit_title,			
// 			'benefits':this.productForm.value.benefits,			
// 			 }
// console.log(params, "params>>>>>>>>>>>>>>>>")
}
