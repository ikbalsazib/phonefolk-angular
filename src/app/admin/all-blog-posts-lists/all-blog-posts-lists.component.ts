import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {BlogPostService} from '../../services/blog-post.service';
import {BlogPostModel} from '../../blog/model/blog-post.model';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-all-blog-posts-lists',
  templateUrl: './all-blog-posts-lists.component.html',
  styleUrls: ['./all-blog-posts-lists.component.scss']
})
export class AllBlogPostsListsComponent implements OnInit, OnDestroy {
  pageTitle = 'View All Blog Posts by PhoneFolk';
  blogPosts = [];
  private subscription: Subscription;
  // For Paginator..
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOption = [1, 3, 5, 10];

  constructor(private blogPostService: BlogPostService) { }

  ngOnInit() {
    this.blogPostService.getAllBlogPosts(this.postsPerPage, this.currentPage);

    this.subscription = this.blogPostService.getPostUpdateListener()
      .subscribe((postsData: {posts: BlogPostModel[], postCount: number}) => {
        this.blogPosts = postsData.posts;
        this.totalPosts = postsData.postCount;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deletePostById(id: string) {
    this.blogPostService.deleteById(id)
      .subscribe(() => {
        this.blogPostService.getAllBlogPosts(this.postsPerPage, this.currentPage);
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.blogPostService.getAllBlogPosts(this.postsPerPage, this.currentPage);
  }
}
