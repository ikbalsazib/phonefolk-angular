import { Component, OnInit } from '@angular/core';
import {BlogPostModel} from '../model/blog-post.model';
import {ActivatedRoute, Params} from '@angular/router';
import {BlogPostService} from '../../services/blog-post.service';

@Component({
  selector: 'app-single-blog-post',
  templateUrl: './single-blog-post.component.html',
  styleUrls: ['./single-blog-post.component.scss']
})
export class SingleBlogPostComponent implements OnInit {
  post: BlogPostModel;
  slugName: string;
  // For Spinner..
  isLoading = false;

  constructor(private route: ActivatedRoute, private blogPostService: BlogPostService) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.params
      .subscribe((params: Params) => {
        this.slugName = params['slugName'];
        this.blogPostService.getSingleBlogPostBySlug(this.slugName)
          .subscribe((postData) => {
            this.post = postData.post;
            this.isLoading = false;
          });
      });
  }

}
