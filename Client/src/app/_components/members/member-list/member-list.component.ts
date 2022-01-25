import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
    members: Member[];
    pagination: Pagination;
    userParams: UserParams;
    user: User;
    genderList = [ 
        { value: "male", display: "Dudes" }, 
        { value: "female", display: "Chicks" }, 
        { value: "non-binary", display: "Non-Binary"}
    ];

    constructor(private memberService: MemberService) { 
        this.userParams = this.memberService.getUserParams();
    }

    ngOnInit(): void {
        this.loadMembers();
    }

    loadMembers() {
        this.memberService.setUserParams(this.userParams);
        this.memberService.getMembers(this.userParams).subscribe(result => {
            this.members = result.result;
            this.pagination = result.pagination;
        })
    }

    resetFilters() {
        this.userParams = this.memberService.resetUserParams();
        this.loadMembers();
    }

    pageChanged(event: any) {
        this.userParams.pageNumber = event.page;
        this.memberService.setUserParams(this.userParams);
        this.loadMembers();
    }
}