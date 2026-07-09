import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  async getLanding(@Res() res: Response) {
    const dashboard = await this.appService.getDashboard();
    const html = this.appService.getLandingPage(dashboard);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Public()
  @Get('health')
  async health() {
    return this.appService.getHealth();
  }

  @Public()
  @Get('login')
  getLoginPage(@Res() res: Response) {
    const html = this.appService.getLoginPage();
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Public()
  @Get('signup')
  getSignupPage(@Res() res: Response) {
    const html = this.appService.getSignupPage();
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Public()
  @Get('admin/login')
  getAdminLoginPage(@Res() res: Response) {
    const html = this.appService.getAdminLoginPage();
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Public()
  @Get('dashboard')
  getDashboardPage(@Res() res: Response) {
    const html = this.appService.getDashboardPage();
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
