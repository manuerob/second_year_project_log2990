import * as aws from 'aws-sdk';
import {
    injectable
} from 'inversify';
import 'reflect-metadata';
import '../../../env';

// tslint:disable: no-console

@injectable()
export class CloudService {
    s3: aws.S3;

    constructor() {
        this.s3 = new aws.S3({
            accessKeyId: process.env.DO_SPACES_KEY,
            secretAccessKey: process.env.DO_SPACES_SECRET,
            endpoint: process.env.DO_SPACES_ENDPOINT,
            signatureVersion: 'v4',
        });
        if (
            !(process.env.DO_SPACES_ENDPOINT ||
                process.env.DO_SPACES_KEY ||
                process.env.DO_SPACES_SECRET ||
                process.env.DO_SPACES_BUCKET)
        ) {
            console.error('ERROR : Cloud storage credentials are missing in .env file');
        }
    }

    putObject(filename: string, content: string): Promise<void> {
        return new Promise((resolve, reject): void => {
            this.s3.createBucket({
                Bucket: process.env.DO_SPACES_BUCKET,
            } as aws.S3.CreateBucketRequest, () => {
                const params: aws.S3.PutObjectRequest = {
                    Bucket: process.env.DO_SPACES_BUCKET,
                    Key: filename,
                    Body: content,
                } as aws.S3.PutObjectRequest;

                this.s3.putObject(params, (error: aws.AWSError, data: aws.S3.PutObjectOutput) => {
                    if (error) {
                        console.error(error);
                        reject();
                    } else {
                        console.log('Successfully uploaded data to ' + process.env.DO_SPACES_BUCKET + '/' + filename);
                        resolve();
                    }
                });
            });
        });
    }

    getObjectContent(filename: string): Promise<string> {
        const params: aws.S3.GetObjectRequest = {
            Bucket: process.env.DO_SPACES_BUCKET,
            Key: filename,
        } as aws.S3.GetObjectRequest;

        return new Promise((resolve, reject): void => {
            this.s3.getObject(params, (error: aws.AWSError, data: aws.S3.GetObjectOutput) => {
                if (error) {
                    if (error.code !== 'NoSuchKey') {
                        console.error(error, error.stack);
                        reject(error);
                    } else {
                        resolve();
                    }
                } else {
                    console.log('Fetched content ' + filename + ' from cloud');
                    const objectContent = data.Body;
                    if (typeof objectContent !== 'undefined') {
                        resolve(objectContent.toString());
                    } else {
                        reject('');
                    }
                }
            });
        });
    }

    listObjects(): Promise<string[]> {
        return new Promise((resolve, reject): void => {
            const params: aws.S3.ListObjectsV2Request = {
                Bucket: process.env.DO_SPACES_BUCKET,
            } as aws.S3.ListObjectsV2Request;

            this.s3.listObjectsV2(params, (error: aws.AWSError, data: aws.S3.ListObjectsV2Output) => {
                if (error) {
                    console.error(error, error.stack);
                    reject(error);
                } else {
                    const files = data.Contents;
                    if (typeof files !== 'undefined') {
                        const filenames: string[] = [];
                        for (const file of files) {
                            const filename = file.Key;
                            if (typeof filename !== 'undefined') {
                                filenames.push(filename);
                            }
                        }
                        console.log('Fetched list of files in the cloud');
                        resolve(filenames);
                    } else {
                        reject([]);
                    }
                }
            });
        });
    }

    deleteObject(filename: string): Promise<void> {
        const params: aws.S3.DeleteObjectRequest = {
            Bucket: process.env.DO_SPACES_BUCKET,
            Key: filename,
        } as aws.S3.DeleteObjectRequest;

        return new Promise((resolve, reject): void => {
            this.s3.deleteObject(params, (error: aws.AWSError, data: aws.S3.DeleteObjectOutput) => {
                if (error) {
                    console.error(error, error.stack);
                    reject();
                } else {
                    console.log(filename + ' deleted from the cloud');
                    resolve();
                }
            });
        });
    }
}
