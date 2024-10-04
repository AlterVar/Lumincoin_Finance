export type AuthInfoType = {
    tokens: {accessToken: string | null,
        refreshToken: string | null,}
    user: UserInfoType | string | null
}

export type UserInfoType = {
    id: number,
    name: string,
    lastName: string,
}

export type SignupInfoType = {
    user: {
        id: number,
        email: string,
        name: string,
        lastName: string
    }
}