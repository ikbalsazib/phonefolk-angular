import {Component, OnDestroy, OnInit} from '@angular/core';
import {faArrowCircleLeft, faCog, faEnvelope, faFileAlt, faMobileAlt, faTachometerAlt, faUsers} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../services/auth.service';
import {faBlog} from '@fortawesome/free-solid-svg-icons/faBlog';
import {faComments} from '@fortawesome/free-solid-svg-icons/faComments';
import {faChartBar} from '@fortawesome/free-solid-svg-icons/faChartBar';
import {faAngry} from '@fortawesome/free-solid-svg-icons/faAngry';
import {BlogPostService} from '../../services/blog-post.service';
import {Subscription} from 'rxjs';
import {BlogPostModel} from '../../blog/model/blog-post.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  // Font awesome Icons..
  faArrowCircleLeft = faArrowCircleLeft;
  faBlog = faBlog;
  faMobileAlt = faMobileAlt;
  faUsers = faUsers;
  faComments = faComments;

  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;

  blogPosts: BlogPostModel[];

  constructor(private blogPostServices: BlogPostService) {}

  ngOnInit() {
    this.blogPostServices.getAllBlogPosts(this.postsPerPage, this.currentPage);
    this.subscription = this.blogPostServices.getPostUpdateListener()
      .subscribe((postsData: {posts: BlogPostModel[], postCount: number}) => {
        this.blogPosts = postsData.posts;
        this.totalPosts = postsData.postCount;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
