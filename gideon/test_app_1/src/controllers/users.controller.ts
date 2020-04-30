import { Controller, Get, Authenticated } from "@tsed/common";
import { User } from "../data/models/entities/user.entity";
import { UsersService } from "../services/users/users.service";
import { CryptoService } from "../services/auth/crypto.service";
import { Description, Returns, Summary } from "@tsed/swagger";

@Controller('/users')
export default class UsersController {
    constructor(private usersService: UsersService, private crypto: CryptoService) {
    }

    @Get("/all")
    @Authenticated({ claim: 'can_do_everything' })
    @Summary("Gel all users")
    @Description(`
            The current implementation allows the administrator to get all claims
        `)
    @Returns(User)
    async getAll(): Promise<User[]> {
        return await this.usersService.find();
    }
}