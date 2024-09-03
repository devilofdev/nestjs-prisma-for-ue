import { HttpService } from '@nestjs/axios';
import { Controller, Get } from '@nestjs/common';
import { DedicatedServerService } from './dedicated-server.service';

@Controller('dedicated-server')
export class DedicatedServerController {
    constructor(private readonly dedicatedServerService: DedicatedServerService) {}

    @Get()
    async fetchServers() {
        return await this.dedicatedServerService.getDedicatedServer();
    }
    
}
