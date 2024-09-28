
export type RouteType = {
    route: string,
    title?: string,
    template?: string,
    layout: boolean,
    styles?: string[],
    scripts?: string[],
    load?: () => void
}