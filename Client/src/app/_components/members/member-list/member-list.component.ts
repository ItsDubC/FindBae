import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  //members$: Observable<Member[]>;
  members: Member[];
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;
  
  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    //this.members$ = this.memberService.getMembers();
    this.loadMembers();
  }

  loadMembers() {
      this.memberService.getMembers(this.pageNumber, this.pageSize).subscribe(result => {
          this.members = result.result;
          this.pagination = result.pagination;
      })
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMembers();
  }
}