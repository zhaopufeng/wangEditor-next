

export interface IMenus {
    menus: string[],
    excludeMenus: string[]

}

export default (function (): IMenus {
    return {
        menus: [],
        excludeMenus: []
    }
})()
