import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MustMatch } from '../../_helpers/must-match.validator';
@Component({
  selector: 'app-admin-verify-email',
  templateUrl: './admin-verify-email.component.html',
  styleUrls: ['./admin-verify-email.component.scss'],
})
export class AdminVerifyEmailComponent implements OnInit {
  formSubmitAttempt: boolean = false;
  formDetails!: FormGroup;
  formDetailsOtp!: FormGroup;
  formResetPassword!: FormGroup;
  displayStyle = 'none';
  message = '';
  displayOtp = 'none';
  displayEmail = 'block';
  displayResetPassword = 'none';
  email: any;
  otp: any;
  config: any = {
    allowNumbersOnly: true,
    length: 6,
  };
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private httpClientModule: HttpClientModule,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formDetails = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
    });

    this.formDetailsOtp = this.formBuilder.group({
      otp: ['', [Validators.required]],
    });

    this.formResetPassword = this.formBuilder.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'
            ),
          ],
        ],
        cpassword: ['', [Validators.required]],
      },
      {
        validator: MustMatch('password', 'cpassword'),
      }
    );
  }

  get getInput() {
    return this.formResetPassword.controls;
  }

  onOtpChange(event) {
    this.otp = event;
    if (this.otp.length == 6) {
      this.formDetailsOtp.controls['otp'].setErrors(null);
    }
  }

  submitOtp() {
    let params: any = {
      email: this.email,
      otp: this.otp,
    };

    this.userService.verifyOtp(params).subscribe(
      (res: any) => {
        console.log(res);
        this.displayStyle = 'block';
        this.message = 'OTP verified';
        setTimeout(() => {
          this.displayOtp = 'none';
          this.displayResetPassword = 'block';
        }, 2000);
      },
      (err: any) => {
        this.displayStyle = 'block';
        this.message = err.error.message;
      }
    );
  }
  resendOtp() {
    let params: any = {
      email: this.formDetails.value.email,
    };
    this.userService.verifyEmail(params).subscribe((res: any) => {
      this.displayStyle = 'block';
      this.message =
        'If this email exists in our database, you will receive a password recovery email.';
      setTimeout(() => {
        this.displayOtp = 'block';
        this.displayEmail = 'none';
      }, 2000);
    });
  }

  submit() {
    this.formSubmitAttempt = true;
    if (this.formDetails.valid) {
      this.email = this.formDetails.value.email;
      let params: any = {
        email: this.formDetails.value.email,
      };
      this.userService.verifyEmail(params).subscribe(
        (res: any) => {
          console.log(res);
          this.displayStyle = 'block';
          this.message =
            'If this email exists in our database, you will receive a password recovery email.';
          setTimeout(() => {
            this.displayOtp = 'block';
            this.displayEmail = 'none';
          }, 2000);
        },
        (err: any) => {
          this.message =
            'If this email exists in our database, you will receive a password recovery email.';
          this.displayStyle = 'block';
          setTimeout(() => {
            this.displayOtp = 'block';
            this.displayEmail = 'none';
          }, 2000);
        }
      );
    }
  }

  resetPassword() {
    let params: any = {
      password: this.formResetPassword.value.password,
      email: this.email,
      otp: this.otp,
    };
    this.userService.resetPassword(params).subscribe(
      (res: any) => {
        console.log(res);
        this.displayStyle = 'block';
        this.message = 'Password Reset Successfully.';
        setTimeout(() => {
          this.router.navigateByUrl('login');
        }, 2000);
      },
      (err: any) => {
        console.log(err);
        this.displayStyle = 'block';
        this.message = err.error.message;
      }
    );
  }

  closePopup() {
    this.displayStyle = 'none';
  }
}
