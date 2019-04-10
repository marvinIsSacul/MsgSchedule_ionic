import { AbstractMessage, TemplateMessage } from '../../../models/Message';



let messagesForFemale: string[] = [
    
];


let messagesForMale: string[] = [
    `Dear {{recepient}}, I send heartiest wishes for the our anniversary celebration.
    Your support and love has made our relationship much deep and I hope it remains this way forever.`,

    `To my sweet {{partner-type}}, loving wishes for our first anniversary.
    It is your smile and your love which makes my heart leap every time I see you and makes the relationship worth.
    `,

    `Heartiest wishes for our anniversary, dear {{partner-type}}.
    You are the living center of my life and it is your love which makes this relationship so special to cherish.
    `,

    `To my cute {{partner-type}}, loving wishes for the first anniversary.
    I wish our relationship to remain this much sweeter and lovelier always and let it give us more together moments to live.`,

    `I send my love and wishes for our anniversary, cute {{partner-type}}.
    I wake up having to look at your beautiful smile and it is the one thing which keeps me full of love each day.`,

    `Heartfelt wishes for our anniversary to my {{partner-type}}.
    I am much loved by the special person I found in you and I am thankful to have you in my life always.`,

    // for messages to be added here ...
];

let messagesForBoth: string[] = [

];



let allMessages: TemplateMessage[] = [];

messagesForFemale.forEach(message => allMessages.push({
    message: message,
    category: 'anniversary',
    for_gender: 'female',
}));

messagesForMale.forEach(message => allMessages.push({
    message: message,
    category: 'anniversary',
    for_gender: 'male',
}));

messagesForBoth.forEach(message => allMessages.push({
    message: message,
    category: 'anniversary',
    for_gender: 'both',
}));


export class Anniversary extends AbstractMessage{
    
    constructor(){
        super(allMessages, 'anniversary');
    }
}