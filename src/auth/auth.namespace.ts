export namespace Auth {
    export interface GoogleRedirectResponse {
        email: string;
        firstName: string;
        lastName: string;
        picture: string;
        accessToken: string;
    }
}
