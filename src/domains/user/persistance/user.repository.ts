import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from '../../../models';
import { UserService } from '../services/user.service';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async getUserInfoById(id: string): Promise<UserService.GetUserByIdResponse> {
    const result = await this.query(`
    SELECT
      u.username, 
      u.first_name, 
      u.last_name, 
      u.avatar_url, 
      sa.public_key 
    FROM 
      "user" u 
    LEFT JOIN 
      stellar_accounts sa 
    ON 
      u.id = sa.owner_id 
    WHERE 
      u.id = '${id}'::uuid
    `);

    return {
      username: result[0].username,
      firstName: result[0].first_name,
      lastName: result[0].last_name,
      avatarUrl: result[0].avatar_url,
      wallet: result[0].public_key,
    };
  }
}
