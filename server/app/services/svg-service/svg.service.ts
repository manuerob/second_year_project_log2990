import { SvgData } from '@common2990/communication/svg-data';
import { SvgMetadata } from '@common2990/communication/svg-metadata';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import * as uuid from 'uuid/v4';
import Types from '../../types';
import { CloudService } from '../cloud-service/cloud.service';
import { DatabaseService } from '../database-service/database.service';
import { ISvg } from './../../../../common/client-server/svg';

// tslint:disable: no-console

@injectable()
export class SvgService {
  svgs: ISvg[];
  svgMetadata: SvgMetadata[];
  svgData: SvgData[];

  constructor(
    @inject(Types.DatabaseService) private databaseService: DatabaseService,
    @inject(Types.CloudService) private cloudService: CloudService,
  ) {
    this.svgs = [];
    this.svgMetadata = [];
    this.svgData = [];
  }

  async getSvgs(): Promise<ISvg[]> {
    const dbFiles = this.databaseService.getAllSvgMetadata();
    const cloudFiles = this.cloudService.listObjects();
    const svgsMetadata = this.intersectDrawingIds(await dbFiles, await cloudFiles);
    return await this.resetLocalDatabase(svgsMetadata);
  }

  private intersectDrawingIds(dbFiles: SvgMetadata[], cloudFiles: string[]): SvgMetadata[] {
    return dbFiles.filter((dbElement) => cloudFiles.some((cloudElement) => dbElement.id === cloudElement));
  }

  private async fetchFile(metadata: SvgMetadata): Promise<void> {
    await this.cloudService.getObjectContent(metadata.id).then((data: string) => {
      if (!data) {
        return;
      }
      const fileData = JSON.parse(data);
      this.svgs.push({
        title: metadata.title,
        tags: metadata.tags,
        id: metadata.id,
        width: metadata.width,
        backgroundColor: metadata.backgroundColor,
        height: metadata.height,
        htmlElement: fileData.htmlElement,
        shapes: fileData.shapes,
        createdAt: metadata.createdAt,
      });
    })
      .catch((error: Error) => {
        console.error(error);
      });
  }

  private resetLocalDatabase(drawingsMetadata: SvgMetadata[]): Promise<ISvg[]> {
    return new Promise<ISvg[]>(async (resolve): Promise<void> => {
      this.svgs = [];
      await this.runParallelFetch(drawingsMetadata);
      resolve(this.svgs);
    });
  }

  private async runParallelFetch(drawingsMetadata: SvgMetadata[]): Promise<void> {
    const promises = drawingsMetadata.map(async (metadata: SvgMetadata) => {
      await this.fetchFile(metadata);
    });
    await Promise.all(promises);
  }

  addSvg(newSvg: ISvg): Promise<void> {
    const unixMilliTime: number = parseInt((Date.now() / 1000).toFixed(0), 10);
    newSvg.id = uuid();
    this.svgs.push(newSvg);
    return new Promise(async (resolve, reject): Promise<void> => {
      await this.databaseService.addSvgMetadata({
        id: newSvg.id,
        title: newSvg.title,
        width: newSvg.width,
        height: newSvg.height,
        backgroundColor: newSvg.backgroundColor,
        tags: newSvg.tags,
        createdAt: unixMilliTime,
      });
      await this.putDataToCloud({
        id: newSvg.id,
        shapes: newSvg.shapes,
        htmlElement: newSvg.htmlElement,
      });
      resolve();
    });
  }

  private async putDataToCloud(newSvgData: SvgData): Promise<void> {
    const svgJson = JSON.stringify(newSvgData);
    return this.cloudService.putObject(newSvgData.id, svgJson);
  }

  async deleteSvg(id: string): Promise<void> {
    return this.cloudService.deleteObject(id);
  }
}
