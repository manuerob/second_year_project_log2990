import { SvgMetadata } from '@common2990/communication/svg-metadata';
import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';
import '../../../env';

// tslint:disable: no-console

@injectable()
export class DatabaseService {

  collection: Collection<SvgMetadata>;

  private options: MongoClientOptions;

  constructor() {
    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    if (
      !(process.env.DATABASE_URL ||
        process.env.DATABASE_NAME ||
        process.env.DATABASE_COLLECTION)
    ) {
      console.error('ERROR : Database credentials are missing in .env file');
    }

    MongoClient.connect(process.env.DATABASE_URL as string, this.options)
      .then((client: MongoClient) => {
        this.collection = client.db(process.env.DATABASE_NAME).collection(process.env.DATABASE_COLLECTION as string);
        console.log('MongoDB connected');
      })
      .catch(() => {
        console.error('MongoDB CONNECTION ERROR');
      });
  }

  async getAllSvgMetadata(): Promise<SvgMetadata[]> {
    return this.collection.find({}).toArray()
      .then((svgMetadata: SvgMetadata[]) => {
        console.log('Fetched list of files in the database');
        return svgMetadata;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  async addSvgMetadata(svgMetadata: SvgMetadata): Promise<void> {
    this.collection.insertOne(svgMetadata)
      .then(() => { console.log('Drawing added to the database'); })
      .catch((error: Error) => {
        throw error;
      });
  }

  async deleteSvgMetadata(queryId: string): Promise<void> {
    return this.collection
      .findOneAndDelete({ id: queryId })
      .then(() => { console.log('Drawing delete from the database'); })
      .catch(() => {
        throw new Error('Failed to delete SvgMetadata');
      });
  }
}
