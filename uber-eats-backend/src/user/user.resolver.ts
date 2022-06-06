import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import {
  CreateAccountInputType,
  CreateAccountOutputType,
} from './dto/create-account.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => Boolean)
  hi() {
    return true;
  }

  @Mutation((type) => CreateAccountOutputType)
  async createAccount(
    @Args('input') createAccounInput: CreateAccountInputType,
  ): Promise<CreateAccountOutputType> {
    try {
      const [ok, error] = await this.userService.createAccount(
        createAccounInput,
      );
      return {
        ok,
        error,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }

  @Mutation((type) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const [ok, error, token] = await this.userService.login(loginInput);
      return {
        ok,
        error,
        token,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: e,
      };
    }
  }
}
