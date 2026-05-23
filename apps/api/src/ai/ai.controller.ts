import { Controller, Get, Post, Body, Param, Req, Query } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { CopilotService } from './copilot.service';
import { ScenarioService } from './scenario.service';

@Controller('ai')
export class AiController {
  constructor(
    private readonly insightsService: InsightsService,
    private readonly copilotService: CopilotService,
    private readonly scenarioService: ScenarioService,
  ) {}

  // --- Insights ---
  @Get('insights')
  getActiveInsights(@Query('portfolioId') portfolioId: string) {
    return this.insightsService.getActiveInsights(portfolioId);
  }

  @Post('insights/:id/dismiss')
  dismissInsight(@Param('id') id: string) {
    return this.insightsService.dismissInsight(id);
  }

  @Post('insights/generate')
  generateInsights(@Body('portfolioId') portfolioId: string) {
    return this.insightsService.generateInsightsForPortfolio(portfolioId);
  }

  // --- Copilot ---
  @Post('copilot/start')
  startConversation(@Req() req: any, @Body('portfolioId') portfolioId: string) {
    const userId = req.user?.id || 'mock-user-id';
    return this.copilotService.startConversation(userId, portfolioId);
  }

  @Post('copilot/:id/message')
  sendMessage(@Req() req: any, @Param('id') id: string, @Body('content') content: string) {
    const userId = req.user?.id || 'mock-user-id';
    return this.copilotService.sendMessage(id, content, userId);
  }

  @Get('copilot/:id')
  getConversation(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.id || 'mock-user-id';
    return this.copilotService.getConversationHistory(id, userId);
  }

  // --- Scenarios ---
  @Post('scenario/:conversationId/run')
  runScenario(
    @Req() req: any, 
    @Param('conversationId') conversationId: string,
    @Body('parameters') parameters: any
  ) {
    const userId = req.user?.id || 'mock-user-id';
    return this.scenarioService.runSimulation(conversationId, parameters, userId);
  }
}
