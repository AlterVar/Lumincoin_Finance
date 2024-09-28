export type InputType = {
        element: HTMLInputElement | null,
        options?: InputOptionsType
}

export type InputOptionsType = {
        pattern?: RegExp,
        compareTo?: string
}