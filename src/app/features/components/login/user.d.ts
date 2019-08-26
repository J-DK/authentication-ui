export interface User {
    firstName: String;
    lastName: String;
    email: String;
    password: String;
    mobile: String;
    userName?: String;
}

export interface LoginUser {
    email: String;
    password: String;
}