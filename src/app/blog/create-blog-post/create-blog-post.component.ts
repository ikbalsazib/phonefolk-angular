import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {BlogPostModel} from '../model/blog-post.model';
import {BlogPostService} from '../../services/blog-post.service';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-create-blog-post',
  templateUrl: './create-blog-post.component.html',
  styleUrls: ['./create-blog-post.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class CreateBlogPostComponent implements OnInit {
  reactiveForm: FormGroup;
  imageView: string;

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

  constructor(private blogPostService: BlogPostService) { }

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
  }

  onSubmitPost() {
    if (this.reactiveForm.invalid) {
      return;
    }

    this.isLoading = true;

    // Post Object..
    const newPost: BlogPostModel = {
      id: null,
      title: this.reactiveForm.value.title,
      content: this.reactiveForm.value.content,
      imageUrl: this.reactiveForm.value.image,
      createdAt: null,
      slugName: this.reactiveForm.value.title.trim().replace(/[?=,!.\s]/g, '-').toLowerCase(),
      creator: {
        name: null
      }
    };

    this.blogPostService.createNewBlogPost(newPost);
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
    // console.log(file);
  }

}
