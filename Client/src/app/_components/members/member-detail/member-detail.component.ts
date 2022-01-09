import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: Member;

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember(this.route.snapshot.paramMap.get('username'));
  }

  loadMember(userName: string) {
    this.memberService.getMember(userName).subscribe(result => {
      this.member = result;
    })
  }
}
