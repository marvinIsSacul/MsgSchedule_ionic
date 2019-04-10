import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Message } from '../../models/Message';

@Component({
  selector: 'schedule-list',
  templateUrl: 'schedule-list.html'
})
export class ScheduleListComponent implements OnInit {

  @Input()
  messages: Message[];  // don't initialize on purpose. so should throw errors when not set.

  @Input()
  display: string;    // don't initialize on purpose. so should throw errors when not set.

  @Output('edit')
  editMessage = new EventEmitter();

  @Output('delete')
  deleteMessage = new EventEmitter();

  @Output('press')
  pressMessage = new EventEmitter();

  @Output('tap')
  tapMessage = new EventEmitter();

  @Output('pause')
  pauseMessage = new EventEmitter();

  @Output('resume')
  resumeMessage = new EventEmitter();


  ngOnInit(){
  }

  /**
   * Gets messages depeding on @member display.
   * 
   * @returns Message[]
   */
  getMessages(): Message[]{
    // !filter || (this.display = filter);
    return this.messages.filter((message: Message) => this.display == 'all' ? true : this.display === message.status);
  }

  emitEvent(event: EventEmitter<any>, message: Message){
    event.emit(message);
  }

}
