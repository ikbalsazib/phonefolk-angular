import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ViewPostListComponent } from './blog/view-post-list/view-post-list.component';
import { CreateBlogPostComponent } from './blog/create-blog-post/create-blog-post.component';
import { HomePageComponent } from './home-page/home-page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SingleBlogPostComponent } from './blog/single-blog-post/single-blog-post.component';
import {BlogPostService} from './services/blog-post.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { RegistrationComponent } from './admin/registration/registration.component';
import { LoginComponent } from './admin/login/login.component';
import {AuthService} from './services/auth.service';
import {AuthInterceptor} from './admin/auth.interceptor';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AllBlogPostsListsComponent } from './admin/all-blog-posts-lists/all-blog-posts-lists.component';
import { EditBlogPostComponent } from './admin/edit-blog-post/edit-blog-post.component';
import { TextShortenPipe } from './pipes/text-shorten.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorModule} from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DemoVisitHeaderComponent } from './demo-visit-header/demo-visit-header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ViewPostListComponent,
    CreateBlogPostComponent,
    HomePageComponent,
    SingleBlogPostComponent,
    RegistrationComponent,
    LoginComponent,
    DashboardComponent,
    PageNotFoundComponent,
    AdminHeaderComponent,
    AllBlogPostsListsComponent,
    EditBlogPostComponent,
    TextShortenPipe,
    DemoVisitHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RichTextEditorAllModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  providers: [AuthService, BlogPostService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
