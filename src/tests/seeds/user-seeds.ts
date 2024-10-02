import { User } from "../../user/entities/user.entity";
import { UserFixture } from "../utils/user-fixture";

export const e2eUsers = {
    johnDoe: new UserFixture(
        new User({
            id: 'john-doe',
            emailAddress: "johndoe@gmail.com",
            password: 'qwerty'
        })
    )
}