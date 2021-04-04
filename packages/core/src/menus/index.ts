/**
 * @description 菜单
 * @author tonghan
 */

export { DropListConf, DropListItem } from './constructor/DropList'
export { PanelTabConf, PanelConf } from './constructor/Panel'
export { TooltipConfItemType } from './constructor/Tooltip'

import Editor from '../editor'
import Menu from './constructor/Menu'

export interface MenuListType {
  [key: string]: any
}

/**
 * 功能菜单
 */
class Menus {
  public menuList: Menu[] = []

  /**
   * 构造函数
   */
  constructor() {}

  /**
   * 初始化菜单
   * @param { Editor } editor 编辑器实例
   */
  public init(editor: Editor): void {
    // 获取所有注册的菜单数据
    const allMenuConstructorList: MenuListType = Object.assign(
      {},
      Editor.globalCustomMenuConstructorList,
      editor.customMenuConstructorList
    )

    // 获取所有需要创建的菜单名称
    const createMenuNameList: string[] = this.getCreateMenuNameList(editor, allMenuConstructorList)

    // 创建菜单
    createMenuNameList.forEach((menuName: string) => {
      this.createMenuConstructor(menuName, allMenuConstructorList[menuName], editor)
    })

    this.appendToToolbar(editor)
  }

  /**
   * 获取需要创建的菜单的数组
   * @param { Editor } editor 编辑器实例
   */
  private getCreateMenuNameList(editor: Editor, allMenuConstructorList: MenuListType): string[] {
    // 获取配置项
    const {
      config: { menus, excludeMenus },
    } = editor

    // 获取配置菜单 - 当配置菜单为空的时候默认拿所有注册过的菜单名称
    const configMenus =
      Array.isArray(menus) && menus.length
        ? Array.from(new Set(menus)) // 去重
        : Object.keys(allMenuConstructorList) // 对象不存在重复，注册的时候也发出了警告

    // 返回 exclude 后的配置菜单
    return Array.isArray(excludeMenus.length) && excludeMenus.length
      ? configMenus.filter(item => !excludeMenus.includes(item))
      : configMenus
  }

  /**
   * 创建功能菜单实例
   * @param { string } menuName 菜单名称
   * @param { any } MenuConstructor 功能菜单的构造器
   */
  private createMenuConstructor(menuName: string, MenuConstructor: any, editor: Editor): void {
    if (!MenuConstructor || typeof MenuConstructor !== 'function') {
      throw TypeError('menuConstructor is not function')
    }

    const menu = new MenuConstructor(editor)
    menu.key = menuName
    this.menuList.push(menu)
  }

  /**
   * 添加到工具栏
   * @param { Editor } editor 编辑器实例
   */
  private appendToToolbar(editor: Editor): void {
    const $toolbarElem = editor.$toolbarElem

    this.menuList.forEach(menu => {
      const { $elem } = menu

      if (!$elem) return editor.logger.error(`Menu ${menu.key} is not $elem`)

      $toolbarElem.append($elem)
    })
  }

  /**
   * 检查菜单激活状态
   */
  public inspectChangeActive(): void {
    let chain = Promise.resolve()

    // 暂用 any ，后面再替换
    this.menuList.forEach(menu => {
      chain = chain.then(_ => (menu as any).tryChangeActive)
    })

    // this.menuList.forEach(menu => {
    //     setTimeout((menu as any).tryChangeActive.bind(menu), 100)
    // })
  }
}

export default Menus
