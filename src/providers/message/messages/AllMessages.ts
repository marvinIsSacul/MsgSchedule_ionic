import { AbstractMessage } from '../../../models/Message';
import { Anniversary } from './Anniversary';
import { Morning } from './Morning';


export class AllMessages{
    private messages: AbstractMessage[];

    constructor(){
        this.messages = [
            new Anniversary(),
            new Morning()
        ];
    }

    getMessagesInCategory(category: string) : AbstractMessage{
        for (let i = 0; i < this.messages.length; ++i)
            if (category == this.messages[i].getCategory())
                return this.messages[i];
        return null;
    }

    getTotalCategories(): number{
        return this.messages.length;
    }

    getCategories(): string[]{
        let categories: string[] = [];
        for (let i = 0; i < this.messages.length; ++i)
            categories.push(this.messages[i].getCategory());
        return categories;
    }

    getRandomCategory(): string{
        let categories: string[] = this.getCategories();

        return categories[categories.length * Math.random() - 1];
    }
}