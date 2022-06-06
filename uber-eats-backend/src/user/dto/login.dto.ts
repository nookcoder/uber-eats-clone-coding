import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from '../../common/dto/core.dto';
import { User } from '../entities/user.entity';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends MutationOutput {
  @Field((returns) => String, { nullable: true })
  token?: string;
}
