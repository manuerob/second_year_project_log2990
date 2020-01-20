// tslint:disable
import { ISvg } from '@common2990/client-server/svg';
import { SvgMetadata } from '@common2990/communication/svg-metadata';
import { assert, expect } from 'chai';
import sinon = require('sinon');
import * as CloudServiceMock from '../cloud-service/cloud.service';
import { CloudService } from '../cloud-service/cloud.service';
import * as DatabaseServiceMock from '../database-service/database.service';
import { DatabaseService } from '../database-service/database.service';
import { SvgService } from './svg.service';


describe('SvgService', () => {
    class FakeCloud {
        s3: any;
        constructor() { }
        putObject(): any { }
        async getObjectContent(): Promise<any> { }
        listObjects(): any { }
        deleteObject(): any { }
    }
    class FakeDatabaseService {
        collection: any;
        options: any = {} as any;
        constructor() { }
        getAllSvgMetadata(): any { }
        addSvgMetadata(svgMetadata: any): any { }
        deleteSvgMetadata(queryId: string): any { }
    }
    let svgService: SvgService;
    let databaseService: FakeDatabaseService;
    let cloudService: FakeCloud;
    const testSvg: ISvg = {
        title: 'testtitle3',
        id: '789',
        tags: ['testTag1', 'testTag2', 'testTag3'],
        width: 123,
        height: 12,
        backgroundColor: '#fff',
        htmlElement: 'testHtml',
        shapes: new Map(),
        createdAt: 0,
    };

    const testMetadata: SvgMetadata[] = [
        {
            title: 'testtitle',
            id: '123',
            width: 123,
            height: 12,
            backgroundColor: '#fff',
            tags: ['testTag1', 'testTag2', 'testTag3'],
            createdAt: 0,
        },
        {
            title: 'testtitle2',
            id: '456',
            width: 123,
            height: 12,
            backgroundColor: '#fff',
            tags: ['testTag1', 'testTag2', 'testTag3'],
            createdAt: 0,
        },
        {
            title: 'testtitle3',
            id: '789',
            width: 123,
            height: 12,
            backgroundColor: '#fff',
            tags: ['testTag1', 'testTag2', 'testTag3'],
            createdAt: 0,
        },
    ];

    databaseService = new FakeDatabaseService();
    cloudService = new FakeCloud();
    svgService = new SvgService(databaseService as unknown as DatabaseService, cloudService as unknown as CloudService);

    let stubCloud: sinon.SinonStub<any[], any>;
    let stubDatabase: sinon.SinonStub<any[], any>;

    beforeEach(() => {
        stubCloud = sinon.stub(CloudServiceMock, 'CloudService').callsFake(() => {
            return new FakeCloud();
        });
        stubDatabase = sinon.stub(DatabaseServiceMock, 'DatabaseService').callsFake(() => {
            return new FakeDatabaseService();
        });
        svgService.svgs = [];
    });

    afterEach(() => {
        stubCloud.restore();
        stubDatabase.restore();
    })

    it('svgs should be empty after construction', async () => {
        assert(expect(svgService.svgs).to.be.empty);
    });

    it('svgs should be get existing svg only', async () => {
        sinon.spy(svgService, 'getSvgs');
        sinon.stub(databaseService, 'getAllSvgMetadata').returns(testMetadata);
        sinon.stub(cloudService, 'listObjects').returns(['456', '789']);
        const fakeData = {
            htmlElement: 'testHtml',
            shapes: new Map(),
        };
        sinon.stub(cloudService, 'getObjectContent').returns(Promise.resolve(JSON.stringify(fakeData)));
        assert(expect(await svgService.getSvgs()).to.be.not.empty);
    });

    it('should return added svgs', async () => {
        svgService.addSvg(testSvg);
        expect(svgService.svgs.length).to.equal(1);
        expect(testSvg.title).to.equal(svgService.svgs[0].title);
        expect(testSvg.tags).to.equal(svgService.svgs[0].tags);
        expect(testSvg.htmlElement).to.equal(svgService.svgs[0].htmlElement);
        assert(expect(svgService.svgs[0].id).to.not.be.empty);
    });

    it('should call delete svg for database', () => {
        const spy = sinon.spy(cloudService.deleteObject);
        svgService.deleteSvg('someId');
        assert(expect(spy.calledOnce));
    });
});
