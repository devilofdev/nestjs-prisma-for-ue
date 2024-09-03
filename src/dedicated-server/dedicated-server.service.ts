import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Axios, AxiosResponse } from 'axios';

export interface IServer {
    pm_id: number,
    name: string,
    playerCount: number,
    port: number,
}

@Injectable()
export class DedicatedServerService {
    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
    ) { }

    async getDedicatedServer() {
        try {
            const MasterServerUrl = this.config.get('MASTER_SERVER_URL');
            const res = await this.httpService.axiosRef.get(`http://localhost:7776/servers`);
            // const res = await this.httpService.axiosRef.get(`${MasterServerUrl}/servers`);
            return {
                data: res.data,
                meta: {
                    total: res.data.length
                }
            }
            // return data;
        } catch (error) {
            throw new BadRequestException('마스터 서버 조회 실패', error);
        }
    }
}
