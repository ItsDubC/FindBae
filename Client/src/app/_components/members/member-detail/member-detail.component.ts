import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MemberService } from 'src/app/_services/member.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
    @ViewChild("memberTabs") memberTabs: TabsetComponent;

    member: Member;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    activeTab: TabDirective;
    messages: Message[] = [];

    constructor(
        private memberService: MemberService,
        private route: ActivatedRoute,
        private messageService: MessageService) { }

    ngOnInit(): void {
        this.loadMember(this.route.snapshot.paramMap.get('username'));
        this.initializeGallery();
    }

    loadMember(userName: string) {
        this.memberService.getMember(userName).subscribe(result => {
            this.member = result;

            this.galleryImages = this.member.photos.map(p => new NgxGalleryImage({
                small: p?.url,
                medium: p?.url,
                big: p?.url
            }));
        })
    }

    initializeGallery() {
        this.galleryOptions = [
            {
                width: '500px',
                height: '500px',
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide,
                preview: false
            }
        ]
    }

    onTabActivated(data: TabDirective) {
        this.activeTab = data;

        if (this.activeTab.heading === "DMs" && this.messages.length === 0) {
            this.loadMessages();
        }
    }

    loadMessages() {
        this.messageService.getMessageThread(this.member.userName).subscribe(response => {
            this.messages = response;
        })
    }
}
