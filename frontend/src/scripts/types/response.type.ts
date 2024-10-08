import {OperationsType} from "./operations.type";
import {CategoriesType} from "./categories.type";
import {AuthInfoType, SignupInfoType} from "./auth-info.type";

export type ErrorResponseType = {
    error: boolean,
    message: string
}

export type TokensResponseType = {
    tokens: { accessToken: string, refreshToken: string }
}

//TODO: объединить в одну сущность. Станет менее понятно, что внутри, но код станет меньше
export type RequestResponseType = {
    error: boolean,
    response: any,
    redirect: string | null
}

export type OperationsResponseType = {
    error: boolean,
    redirect: string | null,
    operations: OperationsType[] | OperationsType | ErrorResponseType | string | null
}

export type CategoriesResponseType = {
    error: boolean,
    redirect: string | null,
    categories: CategoriesType[]| CategoriesType | ErrorResponseType |  null | string
}

export type LoginResponseType = {
    error: boolean,
    redirect: string | null
    login: AuthInfoType | ErrorResponseType | null
}

export type SignupResponseType = {
    error: boolean,
    redirect: string | null
    signup: SignupInfoType | ErrorResponseType | null
}
export type BalanceResponseType = {
    error: boolean,
    redirect: string | null
    balance: string | null
}