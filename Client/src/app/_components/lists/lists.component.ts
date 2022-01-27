import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';

@Component({
    selector: 'app-lists',
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
    members: Partial<Member[]>;
    predicate: string = "liked";

    constructor(private memberService: MemberService) { }

    ngOnInit(): void {
        this.loadLikes();
    }

    loadLikes() {
        this.memberService.getLikes(this.predicate).subscribe(result => {
            this.members = result;
        });
    }
}
