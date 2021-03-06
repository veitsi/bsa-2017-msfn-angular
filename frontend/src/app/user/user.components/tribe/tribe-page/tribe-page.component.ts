import { Component, OnInit } from '@angular/core';
import { ITribe } from '../../../../models/tribe';
import { MdDialog } from '@angular/material';
import { TribeMembersDialogComponent } from '../tribe-members-dialog/tribe-members-dialog.component';
import { ITribePost } from '../../../../models/tribe-post';
import { TribeService } from '../tribe.service';
import { ActivatedRoute } from '@angular/router';
import { WindowObj } from '../../../../services/window.service';
import { ToasterService } from '../../../../services/toastr.service';
import { CreateTribePostComponent } from '../create-tribe-post/create-tribe-post.component';

@Component({
    selector: 'app-tribe-page',
    templateUrl: './tribe-page.component.html',
    styleUrls: ['./tribe-page.component.scss'],
    providers: [TribeService]
})
export class TribePageComponent implements OnInit {
    posts: ITribePost[];
    tribe: ITribe = {
        name: '',
        creator: '',
        members: [],
        banned: [],
        canPost: [],
        canComment: [],
        description: '',
        image: ''
    };
    userId: string;
    tribeID: string;
    canPost: boolean;
    canComment: boolean;
    isBanned: boolean;
    settingsLink: string;

    constructor(private mdDialog: MdDialog,
                private tribeService: TribeService,
                public activatedRoute: ActivatedRoute,
                private toasterService: ToasterService,
                private window: WindowObj) {
        this.userId = (this.window.data._injectedData as any).userId;
        this.tribeID = this.activatedRoute.snapshot.params.id;
        this.settingsLink = '/user/tribe-settings/' + this.tribeID + '/general';
    }

    ngOnInit() {
        if (this.tribeID) {
            this.tribeService.getTribe(this.tribeID, (resp) => {
                this.tribe = resp;
                this.canComment = this.tribe.canComment.includes(this.userId) || this.userId === this.tribe.creator;
                this.canPost = this.tribe.canPost.includes(this.userId) || this.userId === this.tribe.creator;
                this.isBanned = this.tribe.banned.includes(this.userId);
            });
            this.tribeService.getPostsByTribe(this.tribeID, (res) => {
                this.posts = res;
                console.log(this.posts);
            });
        }
    }

    showFollowers() {
        this.mdDialog.open(TribeMembersDialogComponent, {
            data: this.tribe.members
        });
    }

    addPost() {
        this.mdDialog.open(CreateTribePostComponent, {
            data: {
                tribeId: this.tribeID,
                userId: this.userId
            }
        });
    }


    follow() {
        if (!this.tribe.members.includes(this.userId)) {
            this.tribeService.addFollower(this.tribeID, this.userId, () => {});
        } else {
            this.toasterService.showMessage( 'error', 'You already follow this tribe');
        }
    }
}
