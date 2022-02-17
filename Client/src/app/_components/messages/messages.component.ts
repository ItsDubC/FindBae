import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { Pagination } from 'src/app/_models/pagination';
import { ConfirmService } from 'src/app/_services/confirm.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
    messages: Message[];
    pagination: Pagination;
    container = "Unread";
    pageNumber = 1;
    pageSize = 5;
    isLoading = false;

    constructor(private messageService: MessageService, private confirmService: ConfirmService) { }

    ngOnInit(): void {
        this.loadMessages();
    }

    loadMessages() {
        this.isLoading = true;

        this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response => {
            this.messages = response.result;
            this.pagination = response.pagination;
            this.isLoading = false;
        })
    }

    deleteMessage(id: number) {
        this.confirmService.confirm("Confirm delete DM", "You sure?").subscribe(result => {
            if (result) {
                this.messageService.deleteMessage(id).subscribe(() => {
                    this.messages.splice(this.messages.findIndex(x => x.id === id), 1);
                });
            }
        });
    }

    pageChanged(event: any) {
        if (this.pageNumber !== event.page) {
            this.pageNumber = event.page;
            this.loadMessages();
        }
    }
}
