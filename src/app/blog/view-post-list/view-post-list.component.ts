import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlogPostService} from '../../services/blog-post.service';
import {BlogPostModel} from '../model/blog-post.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-view-post-list',
  templateUrl: './view-post-list.component.html',
  styleUrls: ['./view-post-list.component.scss']
})

export class ViewPostListComponent implements OnInit, OnDestroy {
  posts = [];
  private subscription: Subscription;
  public isAuthenticate;
  // For Spinner..
  isLoading = false;
  // For Paginator..
  totalPosts = 0;
  postsPerPage = 3;
  currentPage = 1;
  pageSizeOption = [1, 3, 6, 9];

  constructor(private blogPostService: BlogPostService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    // For Authentication Check..
    this.isAuthenticate = this.authService.getAuthStatus();

    this.blogPostService.getAllBlogPosts(this.postsPerPage, this.currentPage);

    this.subscription = this.blogPostService.getPostUpdateListener()
      .subscribe((postsData: {posts: BlogPostModel[], postCount: number}) => {
          this.posts = postsData.posts;
          this.totalPosts = postsData.postCount;
          this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.blogPostService.getAllBlogPosts(this.postsPerPage, this.currentPage);
  }
}
