export class IUser {
    constructor(
        public _id: string,
        public password: string,
        public salt: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public isCoach: boolean,
        public isAdmin: boolean,
        public position: number,
        public gender: string,
        public day?: number,
        public year?: number,
        public month?: string,
        public weight?: string,
        public height?: string,
        public googleID?: string,
        public facebookID?: string,
        public twitterID?: string,
        public follow?: any[],
        public userPhoto?: string,
        public requestForCoaching?: boolean,
        public secondaryEmails?: string[]
    ) { }
}
