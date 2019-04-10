
import { Injectable, SimpleChange } from '@angular/core';

import { TemplateMessage } from '../../models/Message';
import { AllMessages } from '../message/messages/AllMessages';


/*
  Generated class for the MessageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageProvider {
  allMessages: AllMessages;

  constructor() {
    this.allMessages = new AllMessages();  
  }

  getRandomMessage(category?: string) : TemplateMessage{
    return this.allMessages.getMessagesInCategory(category ? category : this.allMessages.getRandomCategory())
            .getRandomMessage();
  }

  getAllMessages() : AllMessages{
    return this.allMessages
  }

}
