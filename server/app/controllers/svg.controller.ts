import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { ISvg } from '../../../common/client-server/svg';
import { SvgService } from '../services/svg-service/svg.service';
import Types from '../types';

@injectable()
export class SvgController {
  router: Router;
  svgs: ISvg[];

  constructor(
    @inject(Types.SvgService) private svgService: SvgService,
  ) {
    this.configureRouter();
  }

  private configureRouter(): void {
    this.router = Router();

    this.router.get(
      '/',
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await this.svgService.getSvgs();
        res.json(result);
      },
    );

    this.router.post('/', (req: Request, res: Response) => {
      this.svgService.addSvg(req.body);
      res.send(req.body);
    });

    this.router.delete('/:id', (req: Request, res: Response) => {
      this.svgService.deleteSvg(req.params.id);
      res.send();
    });
  }
}
