import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute) { }

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
}
