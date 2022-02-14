import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Group } from '../_models/group';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    baseUrl = environment.apiUrl;
    hubUrl = environment.hubUrl;
    private hubConnection: HubConnection;
    private messageThreadSource = new BehaviorSubject<Message[]>([]);
    messageThread$ = this.messageThreadSource.asObservable();

    constructor(private http: HttpClient) { }

    createHubConnection(user: User, otherUserName: string) {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.hubUrl + "message?user=" + otherUserName, {
                accessTokenFactory: () => user.token
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start().catch(error => console.log(error));

        this.hubConnection.on("ReceiveMessageThread", messages => {
            this.messageThreadSource.next(messages);
        });

        this.hubConnection.on("NewMessage", message => {
            this.messageThread$.pipe(take(1)).subscribe(messages => {
                this.messageThreadSource.next([...messages, message]);
            })
        });

        this.hubConnection.on("UpdatedGroup", (group: Group) => {
            if (group.connections.some(x => x.username === otherUserName)) {
                this.messageThread$.pipe(take(1)).subscribe(messages => {
                    messages.forEach(message => {
                        if (!message.dateRead) {
                            message.dateRead = new Date(Date.now());
                        }
                    });

                    this.messageThreadSource.next([...messages]);
                })
            }
        })
    }

    stopHubConnection() {
        if (this.hubConnection) {
            this.hubConnection.stop();
        }
    }

    getMessages(pageNumber: number, pageSize: number, container: string) {
        let params = getPaginationHeaders(pageNumber, pageSize);
        params = params.append("Container", container);

        return getPaginatedResult<Message[]>(`${this.baseUrl}messages`, params, this.http);
    }

    getMessageThread(username: string) {
        return this.http.get<Message[]>(`${this.baseUrl}messages/thread/${username}`);
    }

    async sendMessage(username: string, content: string) {
        return this.hubConnection.invoke("SendMessage", { recipientUsername: username, content })
            .catch(error => console.log(error));
    }

    deleteMessage(id: number) {
        return this.http.delete(`${this.baseUrl}messages/${id}`);
    }
}
