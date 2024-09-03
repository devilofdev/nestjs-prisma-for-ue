// src/user/user.controller.ts

import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { Pagination, PaginationPrisma } from 'src/common/pagination';
import { UserKeys } from 'src/__generated__/keys';
import { Sort, SortPrisma } from 'src/common/sort';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() data: Prisma.UserCreateInput & { passwordCheck: string }) {
    return this.userService.signup(data);
  }

  @Post('/login')
  async login(@Body() data: Pick<Prisma.UserCreateInput, 'login_id' | 'password'>) {
    return this.userService.login(data);
  }

  @Get()
  async findAll(
    @Pagination() pagination: PaginationPrisma,
    @Sort(UserKeys) sort: SortPrisma,
  ) {
    return this.userService.getUsers(pagination, sort);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    return this.userService.updateUser(+id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
