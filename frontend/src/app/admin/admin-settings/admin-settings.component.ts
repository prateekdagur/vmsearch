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
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss'],
})
export class AdminSettingsComponent implements OnInit {
  displayStyle: any;
  message: any;
  submitted: any;
  settingsData: any;
  AdminSettingsDetails!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private httpClientModule: HttpClientModule,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getAdminSettings().subscribe(
      (response: any) => {
        console.log(response['settings'], 'responsesettings');
        this.settingsData = response['settings'];
        console.log(this.settingsData, 'responsesettings');

        if (!this.settingsData.length) {
          let params: any = {
            nearby_distance: 5,
            introduction_video_url:
              'https://vmsearch.s3.us-west-2.amazonaws.com/622750b2d997365cdf93b521/8808f22b84a48e8505f28dbafa21c407',
            contact_us_name: 'Prateek Dagur',
            contact_us_email: 'prateekdagur8@gmail.com',
            contact_us_phone_number: '9761139605',
            contact_us_address: 'Human World',
          };
          this.userService.createAdminSettings(params).subscribe(
            (response: any) => {
              console.log(response, "responseeeeeeeeeeeeee>>>>>>>>>>>>>>")
            },
            (err: any) => {
              this.displayStyle = 'block';
              this.message = err.error.message;
              Swal.fire(this.message);
            }
          );
        }
        this.AdminSettingsDetails = this.formBuilder.group({
          nearby_distance: [ this.settingsData[0].nearby_distance, [Validators.required]],
          introduction_video_url: [ this.settingsData[0].introduction_video_url, [Validators.required]],
          contact_us_name: [this.settingsData[0].contact_us_name, [Validators.required]],
          contact_us_email: [this.settingsData[0].contact_us_email, [Validators.required]],
          contact_us_phone_number: [this.settingsData[0].contact_us_phone_number, [Validators.required]],
          contact_us_address: [this.settingsData[0].contact_us_address, [Validators.required]],

       }) 
      },
      (err: any) => {
        this.displayStyle = 'block';
        this.message = err.error.message;
        Swal.fire(this.message);
      }
    );
  }

  get personal() {
		return this.AdminSettingsDetails.controls;
	}

  updateSettings() {
    let params: any = {
      nearby_distance: this.AdminSettingsDetails.value.nearby_distance,
      introduction_video_url:
        this.AdminSettingsDetails.value.introduction_video_url,
      contact_us_name: this.AdminSettingsDetails.value.contact_us_name,
      contact_us_email: this.AdminSettingsDetails.value.contact_us_email,
      contact_us_phone_number:
        this.AdminSettingsDetails.value.contact_us_phone_number,
      contact_us_address: this.AdminSettingsDetails.value.contact_us_address,
    };

    this.userService.updateAdminSettings(params).subscribe(
      (res: any) => {
        console.log(res, 'update>>>>>>>>>>>>>>');
        if (res) {
          Swal.fire(res.msg);
        }

        this.displayStyle = 'block';

        this.message = 'Admin Dnr Created';
        this.submitted = true;
      },
      (err: any) => {
        Swal.fire('Something Wrong');
        this.displayStyle = 'block';
        this.message = err.error.message;
      }
    );
  }
}
