import * as crypto from 'crypto';

import { AUTH_SALT } from '../../config';

export const generateToken = (email, accessToken) => {
  return crypto
    .createHash('sha256')
    .update(AUTH_SALT + email + accessToken)
    .digest('hex');
};
