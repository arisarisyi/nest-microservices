import { Test, TestingModule } from '@nestjs/testing';
import { PointOfHireController } from './point-of-hire.controller';
import { PointOfHireService } from './point-of-hire.service';

describe('PointOfHireController', () => {
  let pointOfHireController: PointOfHireController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PointOfHireController],
      providers: [PointOfHireService],
    }).compile();

    pointOfHireController = app.get<PointOfHireController>(
      PointOfHireController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(pointOfHireController.getHello()).toBe('Hello World!');
    });
  });
});
