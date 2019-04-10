
/**
 * 
 */
export class TemplateMessage{
    message: string;    // the actual message
    category: string;   // the type of message (love, valentine, motivation)
    for_gender: string;        // the intended gender (male, female)
}


/**
 * A single message instance, one which gets stored and retrieved from storage
 */
export class Message{
    version: number;

    id: number;                 // the number used to keep track of the message when retrieving and storing it
    message: string;             // the actual message
    time_stored: Date;              // the time the message got stored
    time_scheduled: Date;         // the time the message is to be executed
    status: string;                 // pending or sent or failed
    type: string;                   // SMS, MMS, etc.
    address: string;                 // the phone number to send to
    is_paused: boolean;              // whether is paused or not
}

export abstract class AbstractMessage{
    protected messages: TemplateMessage[];
    protected category: string;

    constructor(messages: TemplateMessage[], category: string){
        this.messages = messages;
        this.category = category;
    }

    getCategory(): string{
        return this.category;
    }

    getMessages(offset: number, total: number = 0): TemplateMessage[]{
       return this.messages.slice(offset, total);
    }

    getMessagesForGender(gender: string): TemplateMessage[]{
        return this.messages.filter(message => message.for_gender == gender);
    }

    getAllMessages(): TemplateMessage[]{
        return this.messages;
    }

    getTotal(): number{
        return this.messages.length;
    }

    getRandomMessage(): TemplateMessage{
        return this.messages.length > 0 ?
            this.messages[Math.random() * this.messages.length - 1] : null;
    }
}