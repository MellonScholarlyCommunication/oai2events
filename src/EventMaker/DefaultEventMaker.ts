import { AbstractEventMaker } from './AbstractEventMaker';
import { IRecordType } from 'src/RecordResolver/AbstractRecordResolver';
import fs from 'fs';

export class DefaultEventMaker extends AbstractEventMaker {
    context: any;
    actor: any;
    origin: any;
    target: any;
    typeMap: any;

    constructor(context: string, actor: string, origin?: string, target?: string, typeMap?: string) {
        super();
        this.context = this.readJson(context);
        this.actor = this.readJson(actor);

        if (origin) {
            this.origin = this.readJson(origin);
        }

        if (target) {
            this.target = this.readJson(target);
        }
        
        this.typeMap = {
            'new': 'Announce',
            'update': 'Announce'
        }

        if (typeMap) {
            this.typeMap = this.readJson(typeMap);
        }
    }

    private readJson(path: string) : any | null {
        if (fs.existsSync(path)) {
            return JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }));
        }
        else {
            return null;
        }
    }

    public async make_event(type: string, info: IRecordType) {
        return new Promise<string | undefined>( (resolve,_reject) =>  {

            if (!this.typeMap[type]) {
                resolve(undefined);
            }

            const event : any = {};

            if (this.context) {
                event['@context'] = this.context;
            }
            else {
                event['@context'] = 'https://www.w3.org/ns/activitystreams';
            }

            event['id'] = this.gen_uuid();
            event['type'] = this.typeMap[type];

            if (this.actor) {
                event['actor'] = this.actor;
            }

            if (this.origin) {
                event['origin'] = this.origin;
            }

            if (info.id) {
                event['object'] = { 'id': info.id };

                if (info.type) {
                    event['object']['type'] = info.type;
                }

                if (info.doi) {
                    event['object']['ietf:cite-as'] = info.doi;
                }

                if (info.title) {
                    event['object']['name'] = info.title;
                }
            }

            if (this.target) {
                event['target'] = this.target;
            }

            resolve(JSON.stringify(event,null,2));
        });
    }
}