import log4js from 'log4js';
import path from 'path';
import fs from 'fs';
import md5 from 'md5';
import { IListIdentifiersRunOptions, ListIdentifiersWatcher } from "./ListIdentifiersWatcher.js";
import { AbstractRecordResolver } from './RecordResolver/AbstractRecordResolver';
import { AbstractEventMaker } from "./EventMaker/AbstractEventMaker";
import { ComponentsManager } from 'componentsjs';

export interface IHarvesterRunOptions {
    silent?: boolean,
    max_records?: number,
    max_records_not_deleted?: number
};

export class Harvester {
    logger: log4js.Logger;
    databaseFile: string;
    baseUrl: string;
    metadataPrefix: string;
    oai_options: any;
    outDir: string;
    config: string;
    options: IHarvesterRunOptions;

    constructor(
        logger: log4js.Logger ,
        databaseFile: string ,
        baseUrl: string ,
        metadataPrefix: string ,
        oai_options: any ,
        outDir: string,
        config: string, 
        options?: IHarvesterRunOptions
    ) {
        this.logger = logger;
        this.databaseFile   = databaseFile;
        this.baseUrl        = baseUrl;
        this.metadataPrefix = metadataPrefix;
        this.oai_options    = oai_options;
        this.outDir         = outDir;
        this.config         = config;

        if (options) {
            this.options = options;
        }
        else {
            this.options = {} as IHarvesterRunOptions;
        }
    }

    public async harvest() : Promise<void> {
        const manager = await this.makeComponentsManager(this.config, '.');
        let resolver = await manager.instantiate<AbstractRecordResolver>(this.baseUrl);
        let maker    = await manager.instantiate<AbstractEventMaker>('urn:oai2events:event-maker');
       
        if (!fs.existsSync(this.outDir)) {
            this.logger.info(`creating outdir ${this.outDir}`);
            fs.mkdirSync(this.outDir, { recursive: true });
        }

        let watcher  = new ListIdentifiersWatcher(
            this.logger,
            this.databaseFile,
            this.baseUrl,
            this.metadataPrefix,
            this.oai_options,
            { 
                max_records : this.options.max_records ,
                max_records_not_deleted: this.options.max_records_not_deleted
            } as IListIdentifiersRunOptions
        );

        watcher.on('new', async (rec) => { 
            this.processor(maker,resolver,rec,'new') 
        });

        watcher.on('update', async (rec) => { 
            this.processor(maker,resolver,rec,'update') 
        });

        watcher.on('delete', async (rec) => { 
                this.processor(maker,resolver,rec,'delete') 
        });

        await watcher.watch();
    }

    private async processor(maker: AbstractEventMaker, resolver: AbstractRecordResolver, rec: any, type: string) {
        let id       = rec['identifier'];

        let metadata = await resolver.resolve(id);

        if (metadata) {
            if (this.options?.silent) {
                this.logger.info(`silent processed ${id}`);
            }
            else {
                let event    = await maker.make_event(type,metadata);

                if (event) {
                    let md5str   = md5(JSON.stringify(rec));
                    let outFile  = `${this.outDir}/${md5str}`; 
                    this.logger.info(`generating ${outFile}`);
                    fs.writeFileSync(outFile,event);
                }
            }
        }
        else {
            this.logger.debug(`no metadata generated to output`);
        }
    }

    private async makeComponentsManager(componentsPath: string, modulePath?: string) : Promise<ComponentsManager<unknown>> {
        let mp = modulePath;
    
        if (mp === undefined) {
            mp = path.join(__dirname, '.');
        }
     
        const manager = await ComponentsManager.build({
            mainModulePath: mp
        });
          
        await manager.configRegistry.register(componentsPath);
    
        return manager;
    }
}