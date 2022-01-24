import { User } from "./user";

export class UserParams {
    gender: string;
    minAge: number = 18;
    maxAge: number = 150;
    pageNumber: number = 1;
    pageSize: number = 5;
    orderBy = "lastActive";

    constructor(user: User) {
        var gender: string;

        switch (user.gender) {
            case "female":
                gender = "male";
                break;
            case "male":
                gender = "female";
                break;
            default:
                gender = "non-binary";
                break;
        }

        this.gender = gender;
    }
}