import { TemplateMessage, AbstractMessage } from '../../../models/Message';



let messagesForFemale: string[] = [
    
];


let messagesForMale: string[] = [
    

    

    // for messages to be added here ...
];

let messagesForBoth: string[] = [
    `Dear {{recepient}}, this morning brings in new hopes and aspirations for you to start a new day with love.
    I wish you a good morning.`,

    // for messages to be added here ...
];



let allMessages: TemplateMessage[] = [];

messagesForFemale.forEach(message => allMessages.push({
    message: message,
    category: 'morning',
    for_gender: 'female',
}));

messagesForMale.forEach(message => allMessages.push({
    message: message,
    category: 'morning',
    for_gender: 'male',
}));

messagesForBoth.forEach(message => allMessages.push({
    message: message,
    category: 'morning',
    for_gender: 'both',
}));


export class Morning extends AbstractMessage{
    
    constructor(){
        super(allMessages, 'morning');
    }
}