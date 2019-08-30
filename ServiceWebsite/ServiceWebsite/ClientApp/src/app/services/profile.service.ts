import {Injectable} from '@angular/core';
import {UserProfile} from '../modules/shared/models/user-profile.model';
import {ApiClient} from './clients/api-client';
import {Logger} from './logger';

@Injectable()
export class ProfileService {
  profile: UserProfile;

  constructor(private apiClient: ApiClient, private logger: Logger) {
  }

  public get isLoggedIn(): boolean {
    return this.profile !== undefined;
  }

  public async getUserProfile(): Promise<UserProfile> {
    if (this.profile) {
      return this.profile;
    }

    try {
      const response = await this.apiClient.getUserProfile().toPromise();
      this.profile = new UserProfile();

      if (response === undefined) {
        return this.profile;
      }

      this.profile.email = response.email;
      this.profile.role = response.role;

      return this.profile;
    } catch (err) {
      this.logger.error(`Error getting user profile: ${err.response}`, err);
    }
  }
}
