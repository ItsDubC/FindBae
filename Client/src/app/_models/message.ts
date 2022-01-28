export interface Message {
    id: number;
    senderId: number;
    senderUsername?: any;
    senderPhotoUrl: string;
    recipientId: number;
    recipientUsername?: any;
    recipientPhotoUrl: string;
    content: string;
    dateRead?: Date;
    messageSent: Date;
}