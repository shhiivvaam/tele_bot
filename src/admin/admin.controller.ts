import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        // Handle successful login and redirect
    }

    @Get('users')
    async getUsers() {
        // Return list of users
    }

    @Get('block-user/:id')
    async blockUser(@Req() req) {
        // Block user by id
    }

    @Get('delete-user/:id')
    async deleteUser(@Req() req) {
        // Delete user by id
    }
}
