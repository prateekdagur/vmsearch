import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login-module/login/login.component';
import { RegisterComponent } from './login-module/register/register.component';
import { AddFrontDeskManagerComponent } from './pages/add-front-desk-manager/add-front-desk-manager.component';
import { EditFrontDeskManagerComponent } from './pages/edit-front-desk-manager/edit-front-desk-manager.component';
import { AddGuestComponent } from './pages/add-guest/add-guest.component';
import { EditGuestComponent } from './pages/edit-guest/edit-guest.component';
import { AddHotelsComponent } from './pages/add-hotels/add-hotels.component';
import { DnrListComponent } from './pages/dnr-list/dnr-list.component';
import { FrontDeskManagerComponent } from './pages/front-desk-manager/front-desk-manager.component';
import { HomeComponent } from './pages/home/home.component';
import { LiveEventsComponent } from './pages/live-events/live-events.component';
import { MyHotelsComponent } from './pages/my-hotels/my-hotels.component';
import { SubscriptionPaymentComponent } from './pages/subscription-payment/subscription-payment.component';
import { SubscriptionQueryComponent } from './pages/subscription-query/subscription-query.component';
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { AuthGuard } from './auth/auth.guard';
import { HotelownerLayoutComponent } from './layouts/hotelowner-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout.component';
import { EditHotelComponent } from './pages/edit-hotel/edit-hotel.component';
import { FeedbackApprovalComponent } from './pages/feedback-approval/feedback-approval.component';
import { FeedbackApprovalDetailComponent } from './pages/feedback-approval-detail/feedback-approval-detail.component';
import { FeedbackApprovalDetail1Component } from './pages/feedback-approval-detail1/feedback-approval-detail1.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { FrontdeskContactUsComponent } from './pages/frontdesk-contact-us/frontdesk-contact-us.component';
import { VerifyEmailComponent } from './login-module/verify-email/verify-email.component';
import { AddFeedbackComponent } from './pages/add-feedback/add-feedback.component';
import { EditFeedbackComponent } from './pages/edit-feedback/edit-feedback.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { FrontDeskLoginComponent } from './pages/front-desk-login/front-desk-login.component';
import { FrontdeskHomeComponent } from './pages/frontdesk-home/frontdesk-home.component';
import { FeedbackRejectedComponent } from './pages/feedback-rejected/feedback-rejected.component';
import { FrontdeskMyaccountComponent } from './pages/frontdesk-myaccount/frontdesk-myaccount.component';
import { IndexComponent } from './pages/index/index.component';

/********************admin routing*********************************/
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import {AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminHotelsComponent } from './admin/admin-hotels/admin-hotels.component';
import { CreateDnrComponent } from './admin/create-dnr/create-dnr.component'
import { AdminDnrComponent } from './admin/admin-dnr/admin-dnr.component'
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminFeedbackComponent } from './admin/admin-feedback/admin-feedback.component';
import { AdminTransactionComponent } from './admin/admin-transaction/admin-transaction.component';
import { AdminSubscriptionComponent } from './admin/admin-subscription/admin-subscription.component';
import { AdminlistSubscriptionComponent } from './admin/adminlist-subscription/adminlist-subscription.component';
import { AdminFeedbackDetailsComponent } from './admin/admin-feedback-details/admin-feedback-details.component';
import { AdminUsersDetailsComponent } from './admin/admin-users-details/admin-users-details.component';
import { AdminSettingsComponent } from './admin/admin-settings/admin-settings.component';
import { SubscriptionUpdateComponent } from './admin/subscription-update/subscription-update.component';
import { AdminResetPasswordComponent } from './admin/admin-reset-password/admin-reset-password.component';
import { AdminHotelDetailsComponent } from './admin/admin-hotel-details/admin-hotel-details.component';
import { AdminFrontdeskManagerComponent } from './admin/admin-frontdesk-manager/admin-frontdesk-manager.component';
import { AdminFeedbackEditComponent } from './admin/admin-feedback-edit/admin-feedback-edit.component';



import { AdminGuard } from './auth/admin.guard';



/************************************************admin routing end*************/

import { environment } from 'src/environments/environment';


const routes: Routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        component: IndexComponent
      }
    ]
  }, 
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_FRONTDESK] },
    children:[{
      path: 'front-desk-home',
      component: FrontdeskHomeComponent
    }]
  }, 
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_FRONTDESK] },
    children:[{
      path: 'front-desk-contact',
      component: FrontdeskContactUsComponent
    }]
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_FRONTDESK] },
    children:[{
      path: 'front-desk-myaccount',
      component: FrontdeskMyaccountComponent
    }]
  }, 
  { 
    path: '', 
    component:LoginLayoutComponent,
    children:[{
      path: 'front-desk-login',
      component: FrontDeskLoginComponent
    }]
  }, 
  { 
    path: '', 
    component:LoginLayoutComponent,
    children:[{
      path: 'login',
      component: LoginComponent
    }]
  }, 
  { 
    path: '', 
    component:LoginLayoutComponent,
    children:[{
      path: 'register',
      component: RegisterComponent
    }]
  },
  
  { 
    path: '', 
    component:LoginLayoutComponent,
    canActivate:[AuthGuard],
    children:[{
      path: 'change-password',
      component: ChangePasswordComponent
    }] 
  },
  { 
    path: '', 
    component:LoginLayoutComponent,
    children:[{
      path: 'verify-email',
      component: VerifyEmailComponent
    }] 
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER] },
    children: [
      {
        path: 'home',
        component: HomeComponent
      }
    ] 
  },

  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER,environment.ROLE_FRONTDESK] },
    children: [
      {
        path: 'notification',
        component: NotificationComponent
      }
    ] 
  },

  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER,environment.ROLE_FRONTDESK] },
    children: [
      {
        path: 'search-result/:q',
        component: SearchResultComponent
      }
    ] 
  },


  

  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER,environment.ROLE_FRONTDESK] },
    children: [
      {
        path: 'add-feedback/:id',
        component: AddFeedbackComponent
      }
    ] 
  },

  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER,environment.ROLE_FRONTDESK] },
    children: [
      {
        path: 'edit-feedback/:id',
        component: EditFeedbackComponent
      }
    ] 
  },

  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER,environment.ROLE_FRONTDESK] },
    children: [
      {
        path: 'live-events',
        component: LiveEventsComponent
      }
    ] 
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER,environment.ROLE_FRONTDESK] },
    children: [
      {
        path: 'dnr-list',
        component: DnrListComponent
      }
    ]  
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER] },
    children: [
      {
        path: 'my-hotels',
        component: MyHotelsComponent
      }
    ]  
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER] },
    children: [
      {
        path: 'add-hotels',
        component: AddHotelsComponent
      }
    ]   
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER] },
    children: [
      {
        path: 'edit-hotel/:id',
        component: EditHotelComponent
      }
    ]   
  },

  
  { 
    path: '', 
    component:LoginLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER] },
    children: [
      {
        path: 'subscription/:id',
        component: SubscriptionComponent
      }
    ]    
  },
  { 
    path: '', 
    component:LoginLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER] },
    children: [
      {
        path: 'subscription-query',
        component: SubscriptionQueryComponent
      }
    ]   
  },
  { 
    path: '', 
    component:LoginLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER] },
    children: [
      {
        path: 'subscription-payment',
        component: SubscriptionPaymentComponent
      }
    ]   
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER,environment.ROLE_FRONTDESK] },
    children: [
      {
        path: 'add-guest',
        component: AddGuestComponent
      }
    ]   
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER,environment.ROLE_FRONTDESK] },
    children: [
      {
        path: 'edit-guest/:id',
        component: EditGuestComponent
      }
    ]   
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER] },
    children: [
      {
        path: 'front-desk-manager',
        component: FrontDeskManagerComponent
      }
    ]   
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: environment.ROLE_HOTEL_OWNER },
    children: [
      {
        path: 'add-front-desk-manager',
        component: AddFrontDeskManagerComponent
      }
    ]  
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER] },
    children: [
      {
        path: 'edit-front-desk-manager/:id',
        component: EditFrontDeskManagerComponent
      }
    ]  
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER] },
    children: [
      {
        path: 'feedback-approvals',
        component: FeedbackApprovalComponent
      }
    ]  
  },

  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER,environment.ROLE_FRONTDESK] },
    children: [
      {
        path: 'feedback-approvals-detail/:id',
        component: FeedbackApprovalDetailComponent
      }
    ]  
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER,environment.ROLE_FRONTDESK] },
    children: [
      {
        path: 'feedback-approvals/:id',
        component: FeedbackApprovalDetail1Component
      }
    ]  
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER,environment.ROLE_FRONTDESK] },
    children: [
      {
        path: 'feedback-rejected',
        component: FeedbackRejectedComponent
      }
    ]  
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER] },
    children: [
      {
        path: 'my-account',
        component: MyAccountComponent
      }
    ]  
  },
  { 
    path: '', 
    component:HotelownerLayoutComponent,
    canActivate:[AuthGuard],
    data: { role: [environment.ROLE_HOTEL_OWNER] },
    children: [
      {
        path: 'contact-us',
        component: ContactUsComponent
      }
    ]  
  },
  
  { 
    path: '', 
    component:LoginLayoutComponent,
    children:[{
      path: 'admin',
      component: AdminLoginComponent
    }]
  }, 
//  { 
//     path: '', 
//     component:AdminHeaderComponent,
//     canActivate:[AdminGuard],
//     children:[{
//       path: 'admin-dashboard',
//       component: AdminDashboardComponent
//     }]
//   }, 

  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'admin-subscription',
      component: AdminSubscriptionComponent
    }]
  }, 
  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'admin-subs-Update/:id',
      component: SubscriptionUpdateComponent
    }]
  }, 

  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'adminlist-subscription',
      component: AdminlistSubscriptionComponent
    }]
  }, 

  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'admin-hotels',
      component: AdminHotelsComponent
    }]
  }, 
  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'admin-users',
      component: AdminUsersComponent
    }]
  }, 
  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'admin-users-details/:id',
      component: AdminUsersDetailsComponent
    }]
  }, 
  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'admin-hotel-details/:id',
      component: AdminHotelDetailsComponent
    }]
  }, 

  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'dnr-create',
      component: CreateDnrComponent
    }]
  }, 
  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'admin-dnr',
      component: AdminDnrComponent
    }]
  }, 
  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'admin-feedback',
      component: AdminFeedbackComponent
    }]
  }, 
  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'admin-feedback-edit/:id',
      component: AdminFeedbackEditComponent
    }]
  }, 
  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'admin-feedback-details/:id',
      component: AdminFeedbackDetailsComponent
    }]
  }, 
  // { 
  //   path: '', 
  //   component:AdminHeaderComponent,
  //   canActivate:[AdminGuard],
  //   children:[{
  //     path: 'admin-dnr',
  //     component: AdminFeedbackComponent
  //   }]
  // }, 
  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'admin-frontdesk-manager',
      component: AdminFrontdeskManagerComponent
    }]
  }, 
  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'admin-transaction',
      component: AdminTransactionComponent
    }]
  }, 
  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'admin-settings',
      component: AdminSettingsComponent
    }]
  }, 
  { 
    path: '', 
    component:AdminHeaderComponent,
    canActivate:[AdminGuard],
    children:[{
      path: 'admin-reset-password',
      component: AdminResetPasswordComponent
    }]
  }, 




  { path: '**', redirectTo: '' }
];

 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
