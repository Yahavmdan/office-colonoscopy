import {GameLink} from 'src/app/shared/models/game-link.model';

export interface AuthUser {
  token: string;
  tokenExpirationAt: string;
}
