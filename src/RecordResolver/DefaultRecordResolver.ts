import { AbstractRecordResolver, type IRecordType } from './AbstractRecordResolver';

const oai = require('oai-pmh');

require('isomorphic-fetch');

export class DefaultRecordResolver extends AbstractRecordResolver {
    baseUrl : string;
    metadataPrefix : string;
    recordUrlPrefix : string;
    landingPagePrefix : string;

    constructor(
        baseUrl: string, metadataPrefix: string = 'oai_dc',
        recordUrlPrefix: string, landingPagePrefix: string) {
        super();
        this.baseUrl = baseUrl;
        this.metadataPrefix  = metadataPrefix;
        this.recordUrlPrefix = recordUrlPrefix;
        this.landingPagePrefix = landingPagePrefix;
    }

    public async resolve(oai_id: string) : Promise<IRecordType | null> {
        this.logger.info(`resolving ${oai_id}`);

        return this.metadata(oai_id);
    }

    private async metadata(oai_id: string) : Promise<IRecordType | null> {
        this.logger.info(`metadata for ${oai_id}`);

        const oaiPmh = new oai.OaiPmh(this.baseUrl);

        const data = await oaiPmh.getRecord(oai_id, this.metadataPrefix);

        const datestamp  = data.header.datestamp;

        this.logger.info(`datestamp ${datestamp}`);

        let record : any = { id: this.landingPagePrefix + oai_id.substring(this.recordUrlPrefix.length) };

        const dc = data.metadata['oai_dc:dc'];

        if (dc) {
           if (dc['dc:title']) {
                record.title = dc['dc:title'];
           } 
        }

        record.type = 'Document';

        this.logger.debug(record);
        
        return record;
    }
}