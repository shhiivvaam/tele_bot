import { Injectable, NotFoundException } from '@nestjs/common';
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
        try {
            // Replace with actual database query, e.g., `return await this.userRepository.find();`
            return this.users;
        } catch (error) {
            throw new NotFoundException('Could not retrieve users');
        }
    }

    async blockUser(id: string) {
        // Replace with actual database logic to block user
        const user = this.users.find(user => user.id === id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        user.blocked = true;

        // Database example:
        // const user = await this.userRepository.findOne(id);
        // if (!user) throw new NotFoundException(`User with ID ${id} not found`);
        // user.blocked = true;
        // await this.userRepository.save(user);
    }

    async deleteUser(id: string) {
        // Replace with actual database logic to delete user
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        this.users.splice(userIndex, 1);

        // Database example:
        // const deleteResult = await this.userRepository.delete(id);
        // if (deleteResult.affected === 0) {
        //   throw new NotFoundException(`User with ID ${id} not found`);
        // }
    }
}
