import { Test, TestingModule } from '@nestjs/testing';
import { ManPowerController } from './man-power.controller';
import { ManPowerService } from './man-power.service';

describe('ManPowerController', () => {
  let manPowerController: ManPowerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ManPowerController],
      providers: [ManPowerService],
    }).compile();

    manPowerController = app.get<ManPowerController>(ManPowerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(manPowerController.getHello()).toBe('Hello World!');
    });
  });
});
