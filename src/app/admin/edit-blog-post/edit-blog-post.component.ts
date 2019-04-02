import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BlogPostService} from '../../services/blog-post.service';
import {BlogPostModel} from '../../blog/model/blog-post.model';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-edit-blog-post',
  templateUrl: './edit-blog-post.component.html',
  styleUrls: ['./edit-blog-post.component.scss']
})
export class EditBlogPostComponent implements OnInit {
  reactiveForm: FormGroup;
  imageView: string;
  postId: string;
  post: BlogPostModel;

  // For Spinner..
  isLoading = false;

  public tools: object = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
  };

  constructor(private blogPostService: BlogPostService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      title: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(5)]
        }),
      content: new FormControl(null,
        {validators: [Validators.required]
        }),
      image: new FormControl(null,
        {validators: [Validators.required]
        })
    });

    this.isLoading = true;

    this.route.params
      .subscribe((params: Params) => {
        this.postId = params['postId'];
        this.blogPostService.getSingleBlogPostById(this.postId)
          .subscribe((postData) => {
            this.isLoading = false;
            this.post = postData.post;
            this.reactiveForm.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imageUrl,
            });
          });
        // console.log(this.postService.getSinglePost(this.postId));
      });
  }

  onUpdatePost() {
    if (this.reactiveForm.invalid) {
      return;
    }

    this.isLoading = true;

    // Post Object..
    // const newPost: BlogPostModel = {
    //   id: null,
    //   title: this.reactiveForm.value.title,
    //   content: this.reactiveForm.value.content,
    //   imageUrl: this.reactiveForm.value.image,
    //   createdAt: null,
    //   slugName: this.reactiveForm.value.title.trim().replace(/[?=,!.\s]/g, '-').toLowerCase(),
    //   creator: {
    //     name: null
    //   }
    // };

    this.blogPostService.updatePost(this.postId, this.reactiveForm.value.title, this.reactiveForm.value.content, this.reactiveForm.value.image, this.reactiveForm.value.title.trim().replace(/[?=,!.\s]/g, '-').toLowerCase());
    // console.log(newPost);

    this.reactiveForm.reset();
  }

  // For Image Upload...
  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.reactiveForm.patchValue({image: file});
    this.reactiveForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageView = reader.result.toString();
    };
    reader.readAsDataURL(file);
    console.log(file);
  }


}
