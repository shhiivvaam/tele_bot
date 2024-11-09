import { Controller, Get, Req, Res, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        // Handle successful login and redirect
        const jwt = this.adminService.generateJwt(req.user);
        res.redirect(`http://localhost:3000/dashboard?token=${jwt}`);
    }

    @Get('users')
    async getUsers() {
        const users = await this.adminService.getUsers();
        return users;
    }

    @Get('block-user/:id')
    async blockUser(@Param('id') id: string) {
        await this.adminService.blockUser(id);
        return { message: `User ${id} has been blocked` };
    }

    @Get('delete-user/:id')
    async deleteUser(@Param('id') id: string) {
        await this.adminService.deleteUser(id);
        return { message: `User ${id} has been deleted` };
    }
}
