import {
  Controller,
  Get,
  Param,
  Req,
  Query,
  Post,
  Body
} from '../../lib/decorator/Controller';
import { AutoWired, Value } from '../../lib/decorator/Bean';
import UserService from '../service/UserService';

@Controller('/user')
export default class UserController {
  @AutoWired
  private userService: UserService;

  @Get('/')
  getUser() {
    return this.userService.getUsers();
  }

  @Get('/:id')
  getUserId(@Param('id') id) {
    return this.userService.getUser(id);
  }

  @Post('/')
  addUser(@Body('user') user) {
    return this.userService.addUser(user);
  }
}
