import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { MemberService } from 'src/app/_services/member.service';

@Component({
    selector: 'app-lists',
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
    members: Partial<Member[]>;
    predicate: string = "liked";
    pageNumber: number = 1;
    pageSize: number = 5;
    pagination: Pagination;

    constructor(private memberService: MemberService) { }

    ngOnInit(): void {
        this.loadLikes();
    }

    loadLikes() {
        this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(result => {
            this.members = result.result;
            this.pagination = result.pagination;
        });
    }

    pageChanged(event: any) {
        this.pageNumber = event.page;
        this.loadLikes();
    }
}
