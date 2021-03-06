import { Component, OnInit, ViewChild } from '@angular/core';
import IArticle = ArticleApi.IArticle;
import { ActivatedRoute, Router } from '@angular/router';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { ToasterService } from '../../../services/toastr.service';
import { NgForm } from '@angular/forms';
import { ArticleAddService } from './article-add.service';
import { MarkdownService } from '../../../services/markdown.service';
import { ArticleDetailComponent } from './../article-detail/article-detail.component';


@Component({
    selector: 'app-article-add',
    templateUrl: './article-add.component.html',
    providers: [ArticleAddService],
    styleUrls: ['./article-add.component.scss']
})
export class ArticleAddComponent implements OnInit {
    article: IArticle = {
        title: '',
        detail: '',
        preview: '',
        image: ''
    };
    image: any = new Image();
    type: string;
    cropperSettings: CropperSettings;
    data: any;
    converted = {
        preview: '',
        detail: ''
    };
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
    hideCropper = true;
    oldImg;

    constructor(private toasterService: ToasterService,
        private articleAddService: ArticleAddService,
        public router: ActivatedRoute,
        private routerNav: Router,
        private markdownService: MarkdownService) {
    }

    ngOnInit() {
        this.data = {};
        this.cropperSettings = this.articleAddService.getCropperSettings();

        if (this.router.snapshot.params.id) {
            this.articleAddService.getById(this.router.snapshot.params.id, (err, data) => {
                this.article = data[0];
                this.converted = {
                    preview: this.markdownService.convert(this.article.preview),
                    detail: this.markdownService.convert(this.article.detail)
                };

            });
        }
    }

    fileChangeListener($event) {

        this.hideCropper = false;
        const file: File = $event.target.files[0];
        if ($event.target.files === 0) {
            return;
        }
        if (file.type.split('/')[0] !== 'image') {
            this.toasterService.showMessage('error', 'wrong format');
            this.hideCropper = true;
            return;
        }
        const myReader: FileReader = new FileReader();
        this.type = file.type.split('/')[1];

        myReader.onloadend = (loadEvent: any) => {
            this.image.src = loadEvent.target.result;
            if (this.type === 'gif') {
                this.article.image = this.image.src;
                this.data.image = this.image.src;
                this.hideCropper = true;
            } else {
                this.cropper.setImage(this.image);
            }
        };
        myReader.readAsDataURL(file);
    }

    cropperBtn(action) {
        if (action === 'save') {
            this.article.image = this.data.image;
        }
        this.hideCropper = true;
    }

    updateOutput(mdText: string, textType) {
        if (textType === 'preview') {
            mdText = mdText.substring(0, 350);
            this.article.preview = mdText;
            this.converted.preview = this.markdownService.convert(mdText);
        }
        this.converted[textType] = this.markdownService.convert(mdText);
    }

    save(form: NgForm) {
        if (form.valid) {
            if (this.data.image) {
                const folder = 'articles-image';
                const fileType = 'img';
                const fileName = this.article.title.replace(/ /g, '_') + Date.now();
                this.articleAddService.saveImg(this.data.image, fileName, fileType, folder, result => {
                    if (result.err) {
                        this.article.image = this.oldImg;
                        this.toasterService.showMessage('error', result.err);
                    } else {
                        this.article.image = './resources/articles-image/' + fileName + '.' + this.type;
                        if (this.article._id) {
                            this.articleAddService.send(this.article, this.article._id, (err, data) => {
                                return true;
                            });
                        } else {
                            this.articleAddService.send(this.article, false, (err, data) => {
                                if (data) {
                                    this.article._id = data._id;
                                }
                            });
                        }
                    }
                });
            } else {
                if (this.article._id) {
                    this.articleAddService.send(this.article, this.article._id, (err, data) => {
                        return this.routerNav.navigate(['/user/articles/' + this.article._id]);
                    });
                } else {
                    this.articleAddService.send(this.article, '', (err, data) => {
                        if (data) {
                            this.article._id = data._id;
                            return this.routerNav.navigate(['/user/articles/' + data._id]);
                        }
                    });
                }
            }
        } else {
            this.toasterService.showMessage('error', 'Fill in all the fields');
        }
    }
}
