export class Config {

  readonly videoAppUrl: string;
  readonly appInsightsInstrumentationKey: string;
  tenantId: string;
  clientId: string;
  postLogoutRedirectUri: string;
  redirectUri: string;
  baseVideoUrl: string;
  pexipSelfTestNodeUri: string;

  constructor(videoAppUrl: string = null, appInsightsInstrumentationKey: string = null) {
    this.videoAppUrl = videoAppUrl;
    this.appInsightsInstrumentationKey = appInsightsInstrumentationKey;
  }
}
