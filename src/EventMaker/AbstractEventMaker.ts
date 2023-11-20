import { v4 as uuidv4 } from 'uuid';
import { Logger , getLogger } from "log4js";
import { IRecordType } from "src/RecordResolver/AbstractRecordResolver";

export abstract class AbstractEventMaker {
    logger : Logger ;

    constructor() {
        this.logger = getLogger();
    }

    public abstract make_event(type: string, info: IRecordType) : Promise<string|undefined>;

    public gen_uuid() : string {
        return 'urn:uuid' + uuidv4();
    }
}