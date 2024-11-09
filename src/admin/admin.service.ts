import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
    private users = []; // This should be replaced with actual database logic

    constructor(private readonly jwtService: JwtService) { }

    generateJwt(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return this.jwtService.sign(payload);
    }

    async getUsers() {
        // Replace with actual database logic
        return this.users;
    }

    async blockUser(id: string) {
        // Replace with actual database logic to block user
        const user = this.users.find(user => user.id === id);
        if (user) {
            user.blocked = true;
        }
    }

    async deleteUser(id: string) {
        // Replace with actual database logic to delete user
        this.users = this.users.filter(user => user.id !== id);
    }
}
