import { Injectable } from '@angular/core';
import {BlogPostModel} from '../blog/model/blog-post.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

const API_URL = environment.herokuNodeServerUrl + '/api/';

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {
  private blogPosts: BlogPostModel[] = [];
  private postUpdated = new Subject<{posts: BlogPostModel[], postCount: number}>();
  private postsCountNum: number;

  constructor(private httpClient: HttpClient, private router: Router) { }

  // For Get All Posts by API..
  getAllBlogPosts(postsPerPages: number, currentPage: number) {
    // this.httpClient.get<{post: BlogPostModel[], message: string}>('http://localhost:5000/api/get-posts')
    //   .subscribe((postData) => {
    //     this.blogPosts = postData.post;
    //     this.postUpdated.next([...this.blogPosts]);
    //   });
    const queryParams = `?pagesize=${postsPerPages}&page=${currentPage}`;
    // When You don't use the Backend variable..
    this.httpClient.get<{post: any, maxPosts: number, message: string}>(API_URL + 'get-posts-by-query' + queryParams)
    .pipe(map((postData) => {
      return {posts: postData.post.map((post) => {
        return {
          id: post._id,
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl,
          createdAt: post.createdAt,
          slugName: post.slugName,
          creator: {
            name: post.creator.name
          }
        };
      }), maxPosts: postData.maxPosts};
    }))
    .subscribe((transformedPostData) => {
      this.blogPosts = transformedPostData.posts;
      this.postUpdated.next({posts: [...this.blogPosts], postCount: transformedPostData.maxPosts});
    });

  }

  // Add New Blog Post Throw API..
  createNewBlogPost(newPost: BlogPostModel) {
    const postData = new FormData();
    postData.append('title', newPost.title);
    postData.append('content', newPost.content);
    postData.append('image', newPost.imageUrl, newPost.title);
    postData.append('slugName', newPost.slugName);

    this.httpClient.post<{message: string}>(API_URL + 'create-post', postData)
      .subscribe((resData) => {
        // console.log(resData.message);
        // this.blogPosts.push(newPost);
        // this.postUpdated.next([...this.blogPosts]);
        this.router.navigate(['pf-admin/all-blog-post-lists']);
      });
  }

  // Get Single Post by Slug...
  getSingleBlogPostBySlug(postSlug: string) {
    return this.httpClient.get<{post: BlogPostModel, message: string}>(API_URL + 'get-post/' + postSlug);
  }

  // Get Single Post by ID...
  getSingleBlogPostById(id: string) {
    return this.httpClient.get<{post: BlogPostModel, message: string}>(API_URL + 'get-post/post-id/' + id);
  }

  // Updating Edited Post..
  updatePost(id: string, edtTitle: string, edtContent: string, image: File | string, edtSlugName: string) {

    let postData: BlogPostModel | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      // postData.append('id', id);
      postData.append('title', edtTitle);
      postData.append('content', edtContent);
      postData.append('image', image, edtTitle);
      postData.append('slugName', edtSlugName);
    } else {
      postData = {
        id: id,
        title: edtTitle,
        content: edtContent,
        imageUrl: image,
        createdAt: null,
        slugName: edtSlugName,
        creator: {
          name: null
        }
      };
    }

    this.httpClient.put(API_URL + 'edit-post/' + id, postData)
      .subscribe((response) => {
        this.router.navigate(['pf-admin/all-blog-post-lists']);
      });
  }

  // Delete Post By ID..
  deleteById(id: string) {
    return this.httpClient.delete<{message: string}>(API_URL + 'delete-post/' + id);
      // .subscribe((postData) => {
      //   const withoutDeletePost = this.blogPosts.filter(post => post.id !== id);
      //   this.blogPosts = withoutDeletePost;
      //   this.postUpdated.next({posts: [...this.blogPosts], postCount: this.postsCountNum});
      //   console.log(postData.message);
      // });
  }

  // Post Update Listener..
  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  // Return Blog Post Count..
  getBlogPostCount() {
    this.httpClient.get<{postCounter: number}>(API_URL + 'get-post-count')
      .subscribe(postData => {
        this.postsCountNum = postData.postCounter;
        this.postUpdated.next({posts: [...this.blogPosts], postCount: postData.postCounter});
      });
  }

}
