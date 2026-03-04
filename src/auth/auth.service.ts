import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserRole } from 'src/auth/user.interface';
import { CONSTS } from 'src/common/consts';
import { StorageService } from 'src/storage/storage/storage.service';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class AuthService {
    constructor(private readonly storage: StorageService) { }

    getMe(apiKey: string) {
        const user = this.findByApiKey(apiKey);
        if (!user) throw new NotFoundException('User not found');
        return { email: user.email, role: user.role, createdAt: user.createdAt };
    }


    register(email: string): { apiKey: string } {
        const users = this.storage.read<User[]>(CONSTS.USERS_FILE);

        if (users.some((u) => u.email === email)) {
            throw new ConflictException(`Email ${email} is already registered`);
        }

        const newUser: User = {
            id: uuidv4(),
            email,
            role: UserRole.USER,
            apiKey: uuidv4(),
            createdAt: new Date().toISOString(),
        };

        this.storage.write(CONSTS.USERS_FILE, [...users, newUser]);
        return { apiKey: newUser.apiKey };
    }

    regenerateKey(apiKey: string): { apiKey: string } {
        const users = this.storage.read<User[]>(CONSTS.USERS_FILE);
        const index = users.findIndex((u) => u.apiKey === apiKey);
        if (index === -1) throw new NotFoundException('User not found');

        const newKey = uuidv4();
        users[index] = { ...users[index], apiKey: newKey };
        this.storage.write(CONSTS.USERS_FILE, users);
        return { apiKey: newKey };
    }

    findByApiKey(apiKey: string): User | undefined {
        return this.storage.read<User[]>(CONSTS.USERS_FILE).find((u) => u.apiKey === apiKey);
    }

    deleteAccount(apiKey: string) {
        const users = this.storage.read<User[]>(CONSTS.USERS_FILE);
        const index = users.findIndex((u) => u.apiKey === apiKey);
        if (index === -1) throw new NotFoundException('User not found');
        users.splice(index, 1);
        this.storage.write(CONSTS.USERS_FILE, users);
    }
}