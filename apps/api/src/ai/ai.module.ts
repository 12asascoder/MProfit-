import { Module } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { CopilotService } from './copilot.service';
import { ScenarioService } from './scenario.service';
import { AiController } from './ai.controller';

@Module({
  controllers: [AiController],
  providers: [InsightsService, CopilotService, ScenarioService],
  exports: [InsightsService, CopilotService, ScenarioService],
})
export class AiModule {}
