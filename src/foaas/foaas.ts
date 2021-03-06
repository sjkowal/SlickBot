import { Message } from 'discord.js';
import got from 'got';

// just cache all the operations rather than pulling them from the service.  
import data from './operations.json'

export class FOAAS {
    private static readonly URL: string =  'https://foaas.com';
    private static readonly DEFAULT_LANGUAGE: string = '?i18n=en';
    private static readonly DEFAULT_NAME: string = 'Mr. X';
    private static readonly DEFAULT_FROM: string = 'SlickBot';
    private static readonly DEFAULT_COMPANY: string = 'Acme';
    private static readonly DEFAULT_NOUN: string = 'rubarb';

    private static randomIndex(max: number) : number {
        return Math.floor(Math.random() * Math.floor(max)); 
    }

    private static randomFO() : any {
        return data[FOAAS.randomIndex(data.length)];
    }

    public static async foff(msg:Message): Promise<string> {
        var insultData = FOAAS.randomFO();
        var insultUrl = insultData.url;
        var hasNameField = false;

        var name = FOAAS.DEFAULT_NAME;
        if (msg.mentions.users.size > 0)  {
            var user = msg.mentions.users.first();
            name = user.username
        } else {
            name = msg.author.username
        }

        insultData.fields.forEach( (element:any) => { 
            var replaceValue = FOAAS.DEFAULT_NOUN;
            if( element.field == "name" ) { 
                replaceValue = name;
                hasNameField = true;
            } else if( element.field == "from") {
                replaceValue = FOAAS.DEFAULT_FROM; 
            } else if( element.field == "company") {
                replaceValue = FOAAS.DEFAULT_COMPANY; 
            }
            insultUrl = insultUrl.replace(':' + element.field, replaceValue);
        })
        
        var requestUrl = FOAAS.URL + insultUrl + FOAAS.DEFAULT_LANGUAGE;
        const response = await got(requestUrl, {responseType: 'json', headers: { 'content-type':'application/json' }})
        const insult = response.body as any;
        var escapedMessage = insult.message.replace('_','\\_');
        return `_${!hasNameField?name.replace('_','\\_') + ', ':''}${insult.message}_`;
    }
}