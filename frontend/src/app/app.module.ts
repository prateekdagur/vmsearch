import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login-module/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './header/header.component'; 
import { RegisterComponent } from './login-module/register/register.component';
import { ReactiveFormsModule} from '@angular/forms'
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgOtpInputModule } from  'ng-otp-input';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { LiveEventsComponent } from './pages/live-events/live-events.component';
import { DnrListComponent } from './pages/dnr-list/dnr-list.component';
import { MyHotelsComponent } from './pages/my-hotels/my-hotels.component';
import { AddHotelsComponent } from './pages/add-hotels/add-hotels.component';
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { SubscriptionQueryComponent } from './pages/subscription-query/subscription-query.component';
import { SubscriptionPaymentComponent } from './pages/subscription-payment/subscription-payment.component';
import { AddGuestComponent } from './pages/add-guest/add-guest.component';
import { FrontDeskManagerComponent } from './pages/front-desk-manager/front-desk-manager.component';
import { AddFrontDeskManagerComponent } from './pages/add-front-desk-manager/add-front-desk-manager.component';
import { dataService } from 'src/app/shared/dataservice.service';
import { AuthGuard } from './auth/auth.guard';
import { HttpInterceptor } from '@angular/common/http';
import { UserService } from './shared/user.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import {NgxPaginationModule} from 'ngx-pagination';
import { HotelownerLayoutComponent } from './layouts/hotelowner-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout.component';
import { EditHotelComponent } from './pages/edit-hotel/edit-hotel.component';
import { VerifyEmailComponent } from './login-module/verify-email/verify-email.component';
import { FeedbackApprovalComponent } from './pages/feedback-approval/feedback-approval.component';
import { FeedbackApprovalDetailComponent } from './pages/feedback-approval-detail/feedback-approval-detail.component';
import { FeedbackApprovalDetail1Component } from './pages/feedback-approval-detail1/feedback-approval-detail1.component';
import { EditGuestComponent } from './pages/edit-guest/edit-guest.component';
import { PhoneMaskDirective } from './phone-mask.directive';
import { NgxMaskModule,IConfig  } from 'ngx-mask';
import { AddFeedbackComponent } from './pages/add-feedback/add-feedback.component';
import { EditFeedbackComponent } from './pages/edit-feedback/edit-feedback.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { EditFrontDeskManagerComponent } from './pages/edit-front-desk-manager/edit-front-desk-manager.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { commonPipe } from './common.pipe';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { DatePipe } from '@angular/common';

/**************admin***************************/

import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminHotelsComponent } from './admin/admin-hotels/admin-hotels.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminDnrComponent } from './admin/admin-dnr/admin-dnr.component';
import { CreateDnrComponent } from './admin/create-dnr/create-dnr.component';
import { AdminTransactionComponent } from './admin/admin-transaction/admin-transaction.component';
import { AdminFeedbackComponent } from './admin/admin-feedback/admin-feedback.component';
import { AdminSubscriptionComponent } from './admin/admin-subscription/admin-subscription.component';
import { AdminlistSubscriptionComponent } from './admin/adminlist-subscription/adminlist-subscription.component';
import { ForgotPasswordComponent } from './admin/forgot-password/forgot-password.component';

import { AdminFeedbackDetailsComponent } from './admin/admin-feedback-details/admin-feedback-details.component';
import { AdminUsersDetailsComponent } from './admin/admin-users-details/admin-users-details.component';
import { AdminSettingsComponent } from './admin/admin-settings/admin-settings.component';
import { SubscriptionUpdateComponent } from './admin/subscription-update/subscription-update.component';
import { AdminResetPasswordComponent } from './admin/admin-reset-password/admin-reset-password.component';
import { AdminHotelDetailsComponent } from './admin/admin-hotel-details/admin-hotel-details.component';
import { AdminFrontdeskManagerComponent } from './admin/admin-frontdesk-manager/admin-frontdesk-manager.component';
import { AdminFeedbackEditComponent } from './admin/admin-feedback-edit/admin-feedback-edit.component';


/**************************admin***********/




import { FrontDeskLoginComponent } from './pages/front-desk-login/front-desk-login.component';
import { FrontdeskHomeComponent } from './pages/frontdesk-home/frontdesk-home.component';
import { FrontdeskMyaccountComponent } from './pages/frontdesk-myaccount/frontdesk-myaccount.component';
import { FrontdeskContactUsComponent } from './pages/frontdesk-contact-us/frontdesk-contact-us.component';
import { FeedbackRejectedComponent } from './pages/feedback-rejected/feedback-rejected.component';
import { IndexComponent } from './pages/index/index.component';




const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
   url: 'https://httpbin.org/post',
   maxFilesize: 50,
   acceptedFiles: 'image/*'
 };

 const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    RegisterComponent,
    LiveEventsComponent,
    DnrListComponent,
    MyHotelsComponent,
    AddHotelsComponent,
    SubscriptionComponent,
    SubscriptionQueryComponent,
    SubscriptionPaymentComponent,
    AddGuestComponent,
    FrontDeskManagerComponent,
    AddFrontDeskManagerComponent,
    HotelownerLayoutComponent,
    LoginLayoutComponent,
    EditHotelComponent,
    VerifyEmailComponent,
    FeedbackApprovalComponent,
    FeedbackApprovalDetailComponent,
    EditGuestComponent,
    PhoneMaskDirective,
    AddFeedbackComponent,
    EditFeedbackComponent,
    MyAccountComponent,
    EditFrontDeskManagerComponent,
    commonPipe,
    ChangePasswordComponent, 
    CreateDnrComponent,
    SearchResultComponent,
    NotificationComponent,
    ForgotPasswordComponent,
    FrontDeskLoginComponent,
    FrontdeskHomeComponent,
    FrontdeskMyaccountComponent,
    FrontdeskContactUsComponent,
    FeedbackApprovalDetail1Component,
    /*****admin***/

    CreateDnrComponent,
    SubscriptionUpdateComponent,
    ForgotPasswordComponent,
    AdminTransactionComponent, 
    AdminLoginComponent,
    //AdminDashboardComponent,
    AdminDnrComponent,
    AdminHeaderComponent,
    AdminHotelsComponent,
    AdminUsersComponent,
    AdminFeedbackComponent,
    AdminSubscriptionComponent,
    AdminFeedbackDetailsComponent,
    AdminUsersDetailsComponent,
    AdminlistSubscriptionComponent,
    AdminSettingsComponent,
    AdminResetPasswordComponent,
    AdminHotelDetailsComponent,
    AdminFrontdeskManagerComponent,
    AdminFeedbackEditComponent,  
    FeedbackRejectedComponent, IndexComponent    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgOtpInputModule,
    NgxIntlTelInputModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GooglePlaceModule,
    NgxDropzoneModule,
    DropzoneModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    NgxMaskModule.forRoot()
  ],

  exports: [
    HeaderComponent,
  ],
  
  providers: [AuthGuard,UserService,dataService,DatePipe,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    },
    {
      provide:HTTP_INTERCEPTORS,
      multi:true,
      useClass:AuthInterceptor,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
