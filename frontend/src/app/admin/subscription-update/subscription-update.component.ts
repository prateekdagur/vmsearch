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
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-subscription-update',
  templateUrl: './subscription-update.component.html',
  styleUrls: ['./subscription-update.component.scss'],
})
export class SubscriptionUpdateComponent implements OnInit {
  productForm!: FormGroup;
  isSubmit: boolean = false;
  countBenefits: any = [];
  getSubscription: any;
  getbenefits: any = [];
  setvarforTable: boolean = false;
  setvarforForm: boolean = true;
  s: any = 'jjjjjjj';
  displayStyle = 'none';
  message = '';
  subsID: any;
  updateData: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private httpClientModule: HttpClientModule,
    private router: Router
  ) {
    // this.productForm = this.fb.group({
    //   title: new FormControl(''),
    //   month: new FormControl(''),
    //   price: new FormControl(''),
    //   benefit_title: new FormControl(''),
    //   benefits: this.fb.array([]),
    // });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.subsID = params['id'];
      console.log(this.subsID, 'iddddddddddddd');
    });

    this.userService.getAdminSubscriptionbyId(this.subsID).subscribe(
      (response) => {
        this.updateData = response;
        console.log(this.updateData.benefits.length, 'llllllllllllllll');
        this.countBenefits = this.updateData.benefits;

        // this.productForm = this.fb.group({
        //   title: new FormControl(this.updateData.title),
        //   month: new FormControl(this.updateData.month),
        //   price: new FormControl(this.updateData.price),
        //   benefit_title: new FormControl(this.updateData.benefit_title),
        //   benefits: this.fb.array([]),
        // });
        this.productForm = this.fb.group({
          title: [this.updateData.title, [Validators.required]],
          month: [ this.updateData.month, [Validators.required]],
          price: [this.updateData.price, [Validators.required]],
          benefit_title: [this.updateData.benefit_title],
          benefits: this.fb.array([]),
       }) 

        for (let i = 0; i < this.countBenefits.length; i++) {
          console.log(this.countBenefits[i], 'cccccccccccccc>>>>>>>>>>>>>.');

          this.newBenefit(this.countBenefits[i]);
          this.addBenefit(this.countBenefits[i]);
        }
      },
      (err: any) => {
        Swal.fire('Something Wrong!');
        this.displayStyle = 'block';
        this.message = err.error.message;
      }
    );
  }

  get pForm() {
    return this.productForm;
  }
  benefits(): FormArray {
    return this.productForm.get('benefits') as FormArray;
  }

  newBenefit(value): FormGroup {
    return this.fb.group({
      benefit: value,
    });
  }

  addBenefit(value) {
    this.benefits().push(this.newBenefit(value));
  }

  removeBenefit(i: number) {
    console.log(i, "iiiiiiiiiiiii")
    console.log(this.benefits().removeAt(i), 'rrrrrrrrrrrrrrr>>>>>>>>>>>>>>>');
    this.benefits().removeAt(i);
  }
  get personal() {
		return this.productForm.controls;
	}
  updateSubscription() {
    console.log(this.productForm.value, 'update subscription>>>>>>>>>>>>>');
    this.userService
      .upadteAdminSubscription(this.productForm.value, this.subsID)
      .subscribe(
        (response) => {
          if (response) {
            this.productForm.reset();
             Swal.fire(response['msg']);
            this.router.navigate(['/adminlist-subscription']);
          }
        },
        (err: any) => {
          this.displayStyle = 'block';
          this.message = err.error.msg;
          Swal.fire(this.message);
        }
      );
  }
}
