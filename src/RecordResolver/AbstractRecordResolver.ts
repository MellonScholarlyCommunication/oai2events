import { getLogger, Logger } from "log4js";

require('isomorphic-fetch');

export interface IRecordType {
    id : string,
    title? : string ,
    doi? : string ,
    type? : string
};

export abstract class AbstractRecordResolver {
    logger : Logger ;

    constructor() {
        this.logger = getLogger();
    }

    public abstract resolve(oai_id: string) : Promise<IRecordType | null>;
}