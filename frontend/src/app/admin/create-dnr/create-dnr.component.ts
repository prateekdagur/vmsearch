import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-dnr',
  templateUrl: './create-dnr.component.html',
  styleUrls: ['./create-dnr.component.scss'],
})
export class CreateDnrComponent implements OnInit {
  AdminDnrDetails! :  FormGroup
  submitted: any = false;
  displayStyle = 'none';

  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private httpClientModule: HttpClientModule,
    private router: Router
  ) {}

  // AdminDnrDetails = this.formBuilder.group({
  //   dnr_title: [null, [Validators.required]],
  // });
  ngOnInit(): void {
    this.AdminDnrDetails = this.formBuilder.group({
      dnr_title: ['', [Validators.required]],
   }) 
  }
  get personal() {
		return this.AdminDnrDetails.controls;
	}

  createDnr() {
    let params: any = {
      dnr_title: this.AdminDnrDetails.value.dnr_title,
    };
    this.userService.createAdminDnr(params).subscribe(
      (res: any) => {
        console.log(res, 'under');
        if (res) {
           Swal.fire(res.msg);
          this.AdminDnrDetails.reset();
          this.router.navigate(['/admin-dnr'])
        }
        this.submitted = true;
      },
      (err: any) => {
        this.displayStyle = 'block';
        this.message = err.error.msg;
        console.log(this.message, "mmmmmmmmmmmm")
        Swal.fire(this.message);

      }
    );
  }
}
// "node_modules/sweetalert2/src/sweetalert2.scss"
