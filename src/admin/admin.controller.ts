import { Controller, Get, Req, Res, UseGuards, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        try {
            const jwt = this.adminService.generateJwt(req.user);
            res.redirect(`${process.env.BACKEND_URL}/dashboard?token=${jwt}`);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Login failed');
        }
    }

    @Get('users')
    async getUsers() {
        try {
            const users = await this.adminService.getUsers();
            return { success: true, data: users };
        } catch (error) {
            throw new HttpException('Could not retrieve users', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('block-user/:id')
    async blockUser(@Param('id') id: string) {
        try {
            await this.adminService.blockUser(id);
            return { success: true, message: `User ${id} has been blocked` };
        } catch (error) {
            throw new HttpException(`Could not block user ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('delete-user/:id')
    async deleteUser(@Param('id') id: string) {
        try {
            await this.adminService.deleteUser(id);
            return { success: true, message: `User ${id} has been deleted` };
        } catch (error) {
            throw new HttpException(`Could not delete user ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
