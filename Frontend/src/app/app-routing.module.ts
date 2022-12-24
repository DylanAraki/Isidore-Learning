import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
//import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';


/* import { EditComponent } from './edit/edit.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { LearnComponent } from './learn/learn.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SiteGuideComponent } from './site-guide/site-guide.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { UserComponent } from './user/user.component';
import { VideosComponent } from './videos/videos.component';
import { ViewComponent } from './view/view.component'; */

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'sign-up', component: SignUpComponent},
/*   {path: 'sign-in', component: SignInComponent}
 */  /* {
    path: 'learn/:mapId/:title',
    component: LearnComponent,
    children: [
      { path: 'edit', component: EditComponent },
      { path: 'view', component: ViewComponent }
    ]
  },
  { path: 'user/:userId/:username', component: UserComponent },
  { path: 'search', component: SearchComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'videos', component: VideosComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'site-guide', component: SiteGuideComponent },
  { path: 'feedback', component: FeedbackComponent }, */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
