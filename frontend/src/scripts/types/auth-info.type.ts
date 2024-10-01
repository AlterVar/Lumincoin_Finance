export type AuthInfoType = {
    accessToken: string | null,
    refreshToken: string | null,
    userInfo: UserInfoType | string | null
}

export type UserInfoType = {
    id: number,
    name: string,
    lastName: string,
}

export type SignupInfoType = {
    id: number,
    email: string,
    name: string,
    lastName: string
}