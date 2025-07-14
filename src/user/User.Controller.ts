import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  Post,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.Dto';
import { UpdateUserDto } from './dto/UpdateUser.Dto';
import { UserService } from './User.Service';
import { JwtPayload } from '../auth/types/JwtPayload';
import { GetUser } from '../auth/decorators/GetUser.Decorator';
import { JwtAuthGuard } from '../auth/guards/Auth.Guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from './guards/Roles.Guard';
import { Roles } from './Roles.Decorator';
import { UserRoleEnum } from './UserRole.enum';

@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get()
  findAll() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Delete(':id')
  deleteAnyUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@GetUser() user: JwtPayload) {
    return this.userService.getUserById(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Body() dto: UpdateUserDto, @GetUser() user: JwtPayload) {
    return this.userService.updateUser(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  deleteMe(@GetUser() user: JwtPayload) {
    return this.userService.deleteUser(user.userId);
  }
}
