import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../modules/shared/models/config';

export let ENVIRONMENT_CONFIG: Config = new Config();

@Injectable()
export class ConfigService {
  constructor(private httpClient: HttpClient) {
  }

  load(): Promise<Config> {
    return this.httpClient.get('/api/config')
      .toPromise()
      .then(result => this.parse(result))
      .catch(err => {
        console.log(`failed to read configuration: ${err}`);
        throw err;
      });
  }

  private parse(result: any): Promise<Config> {
    ENVIRONMENT_CONFIG = new Config(result.video_app_url, result.app_insights_instrumentation_key);
    ENVIRONMENT_CONFIG.tenantId = result.tenant_id;
    ENVIRONMENT_CONFIG.clientId = result.client_id;
    ENVIRONMENT_CONFIG.redirectUri = result.redirect_uri;
    ENVIRONMENT_CONFIG.postLogoutRedirectUri = result.post_logout_redirect_uri;
    ENVIRONMENT_CONFIG.baseVideoUrl = result.base_video_url;
    ENVIRONMENT_CONFIG.pexipSelfTestNodeUri = result.pexip_self_test_node_uri;
    return Promise.resolve(ENVIRONMENT_CONFIG);
  }
}
