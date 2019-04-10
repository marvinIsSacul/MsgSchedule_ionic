
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Message } from '../../models/Message';

import { SQLiteObject, DbTransaction } from '@ionic-native/sqlite/ngx';



@Injectable()
export class MessageScheduleProvider {

  db: SQLiteObject;

  DB_FILE = 'message-scheduler.db';

  VERSION: number = 1;
  MSG_KEY_RESET: number = 0;
  MSG_KEY: string = 'schedule_id'
  MSG_SCHEDULE: string = 'schedule_messages';

  constructor(public storage: Storage) {
    this.initDatabase()
  }

  private initDatabase(){
    /* let v = this.sqlite.create({
      'name': this.DB_FILE,
      'location': 'default'
    }) */

    //console.log(v);
    /*.then((value: SQLiteObject) => {
      this.db = value;
      this.createTables();
    })
    .catch(error => {
      console.error(error);
    });*/
  }

  private createTables(){
    /* this.db.transaction((tx: DbTransaction) => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS messages(
                  id INTEGER PRIMARY KEY,
                  message TEXT,
                  type TEXT,
                  category TEXT,
                  for_gender TEXT,
                  created_at INTEGER
                  scheduled_at INTEGER
                  is_paused INTEGER
                  destination_address TEXT
                  result TEXT
                  )`);

      tx.executeSql(`CREATE TABLE IF NOT EXISTS process_attempts(
                  id INTEGER PRIMARY KEY,
                  message_id INTEGER,
                  created_at INTEGER
                  result TEXT
                )`);
    }); */
  }

  private async getCurrentId(): Promise<number>{
    let id: number = await this.storage.get(this.MSG_KEY);
    return id || this.MSG_KEY_RESET;
  }

  private async incrementId(): Promise<number>{
    let id: number = await this.getCurrentId();

    await this.storage.set(this.MSG_KEY, ++id);
    
    return id;
  }

  addMsg(message: Message){
    /*message.time_stored = new Date();
    message.is_executed = false;
    message.type = 'SMS'; // should not put this here.
    message.is_paused = false;

    let sql: string = `
      INSERT INTO messages (message, type, category, for_gender, created_at, scheduled_at,
                            is_paused, destination_address, result)
              VALUES(
                ${message.message},
                ${message.type},
                ${message.category},
                ${message.for},
                ${message.time_stored},
                ${message.time_scheduled},
                ${message.is_paused},
                ${message.number},
                'pending'
              )
    `; 

    return of(this.db.executeSql(sql, [])); */
  }

  async addMessage(message: Message): Promise<Message>{
    let messages = await this.getAllMessages();
    let isSuccess: boolean = false;
    
    message.version = this.VERSION;
    message.time_stored = new Date();
    message.id = await this.incrementId();
    message.status = 'pending';
    message.is_paused = false;

    messages.push(message);

    await this.storage.set(this.MSG_SCHEDULE, messages)
          .then(() => isSuccess = true);

    return new Promise<any>((onSuccess, onFailure) => {
      if (isSuccess) return onSuccess(message);
      else return onFailure();
    });
  }

  async getAllMessages(): Promise<Message[]>{
    let isSuccess = true;
    let messages: Message[] = await this.storage.get(this.MSG_SCHEDULE).catch(() => isSuccess = false);

    return new Promise<Message[]>((onSuccess, onFailure) => {
      if (isSuccess){
        if (!messages || !(messages instanceof Array)) onSuccess([]);
        else return onSuccess(messages);
      }
      else return onFailure();
    });
  }

  async getMessageById(id: number): Promise<Message>{
    let messages: Message[] = await this.storage.get(this.MSG_SCHEDULE);
    let leftMessages: Message[] = messages.filter(message => message.id == id);

    return new Promise<Message>((onSuccess, onFailure) => {
      if (leftMessages.length === 1) return onSuccess(leftMessages[0]);
      else return onFailure();
    });
  }

  async removeMessageById(id: number): Promise<any>{
    let messages: Message[] = await this.getAllMessages();
    const oldMessagesLength = messages.length;
    let leftMessages: Message[];
    let isSuccess: boolean = false;

    leftMessages = messages.filter((message: Message) => message.id != id);

    await this.storage.set(this.MSG_SCHEDULE, leftMessages)
          .then(() => isSuccess = true);

    return new Promise((onSuccess, onFailure) => {
      if (isSuccess && oldMessagesLength > 0 && leftMessages.length !== messages.length)
        return onSuccess();
      else
        return onFailure();
    });
  }

  createOrUpdateMessages(newMessages: Message[]): Promise<Message>{
    return this.storage.set(this.MSG_SCHEDULE, newMessages);
  }

  async updateMessage(newMessageData: Message): Promise<Message>{
    let messages: Message[] = await this.getAllMessages();
    let isFound: boolean = false;
    let message: Message = null;
    
    for(let i = 0; i < messages.length; ++i){
      message = messages[i];
      if (message.id == newMessageData.id){
        message = Object.assign(message, newMessageData);
        isFound = true;
        break;
      }
    }

    if (isFound){
      try{
        await this.storage.set(this.MSG_SCHEDULE, messages);
      }catch (exception){
        isFound = false;
      }
    }

    return new Promise<Message>((resolve, reject) => {
      return isFound ? resolve(message) : reject();
    });
  }

  async clearAll(): Promise<any>{
    try{
      await this.storage.set(this.MSG_KEY, this.MSG_KEY_RESET);
      return this.storage.set(this.MSG_SCHEDULE, []);
    }catch (e){
      return new Promise((resolve, reject) => {
        return reject();
      });
    }
  }

}
