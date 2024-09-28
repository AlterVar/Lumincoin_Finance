export type AuthInfoType = {
    accessToken: string,
    refreshToken: string,
    userInfo: UserInfoType
}

export type UserInfoType = {
    id: number,
    name: string,
    lastName: string
}

export type SignupInfoType = {
    id: number,
    email: string,
    name: string,
    lastName: string
}