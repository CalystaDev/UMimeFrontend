import { Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { MimeNewComponent } from './screens/mime-new/mime-new.component';
import { HostDirectoryComponent } from './screens/host-directory/host-directory.component';
import { FeedbackPageComponent } from './screens/feedback-page/feedback-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'mime-new',
    component: MimeNewComponent,
  }, 
  {
    path: 'host-directory',
    component: HostDirectoryComponent,
  },
  {
    path: 'feedback',
    component: FeedbackPageComponent,
  }
];