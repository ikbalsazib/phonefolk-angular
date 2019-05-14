import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ViewPostListComponent} from './blog/view-post-list/view-post-list.component';
import {CreateBlogPostComponent} from './blog/create-blog-post/create-blog-post.component';
import {HomePageComponent} from './home-page/home-page.component';
import {SingleBlogPostComponent} from './blog/single-blog-post/single-blog-post.component';
import {RegistrationComponent} from './admin/registration/registration.component';
import {LoginComponent} from './admin/login/login.component';
import {DashboardComponent} from './admin/dashboard/dashboard.component';
import {AuthGuard} from './services/auth.guard';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AdminHeaderComponent} from './admin/admin-header/admin-header.component';
import {AllBlogPostsListsComponent} from './admin/all-blog-posts-lists/all-blog-posts-lists.component';
import {EditBlogPostComponent} from './admin/edit-blog-post/edit-blog-post.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'our-blog', component: ViewPostListComponent},
  {path: 'our-blog/:slugName', component: SingleBlogPostComponent},
  // For Admin Access Route..
  {path: 'pf-admin', component: AdminHeaderComponent, canActivate: [AuthGuard], children: [
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
      {path: 'all-blog-post-lists', component: AllBlogPostsListsComponent, canActivate: [AuthGuard]},
      {path: 'create-blog-post', component: CreateBlogPostComponent, canActivate: [AuthGuard]},
      {path: 'register-new-user', component: RegistrationComponent, canActivate: [AuthGuard]},
      {path: 'edit-blog-post/:postId', component: EditBlogPostComponent, canActivate: [AuthGuard]}
    ]},
  // for Auth Guard Login..
    {path: 'pf-admin/login', component: LoginComponent},
  { path: 'register-new-user', component: RegistrationComponent },
  // Page Not Found..
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
