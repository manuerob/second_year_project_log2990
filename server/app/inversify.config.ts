import { Container } from 'inversify';
import { Application } from './app';
import { SvgController } from './controllers/svg.controller';
import { Server } from './server';
import { CloudService } from './services/cloud-service/cloud.service';
import { DatabaseService } from './services/database-service/database.service';
import { SvgService } from './services/svg-service/svg.service';
import Types from './types';
/* tslint:disable */
const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.SvgController).to(SvgController);
container.bind(Types.SvgService).to(SvgService);
container.bind(Types.DatabaseService).to(DatabaseService);
container.bind(Types.CloudService).to(CloudService);

export { container };
