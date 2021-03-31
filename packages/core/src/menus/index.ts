/**
 * @description 菜单
 * @author luochao
 */

import Editor from '../editor'
import BtnMenu from './BtnMenu'
import DropListMenu from './DropListMenu'
import PanelMenu from './PanelMenu'

type MenuType = BtnMenu | DropListMenu | PanelMenu

type MenuTarget = {
  __isMenu: boolean
  name: string
}
class Menus {
  public editor: Editor
  private menusList: WeakMap<MenuTarget, any>
  private targetMap: Map<string, MenuTarget>

  constructor(editor: Editor) {
    this.editor = editor
    this.menusList = new WeakMap()
    this.targetMap = new Map()
  }

  public registerMenu(name: string, menu: MenuType, config: any): Menus {
    if (this.hasMenu(name)) {
      throw new Error('该菜单名已注册，请换成其它的名字')
    }

    const menuTarget: MenuTarget = {
      __isMenu: true,
      name,
    }

    menu.config = Object.assign({}, menu.config, config)

    this.menusList.set(menuTarget, menu)
    this.targetMap.set(name, menuTarget)
    return this
  }

  public hasMenu(name: string): boolean {
    const menuTarget = this.targetMap.get(name)
    return !!menuTarget
  }

  public getMenu(name: string): MenuType {
    if (!this.hasMenu(name)) {
      throw new Error('该菜单不存在，请传入正确的菜单名称')
    }
    const menuTarget = this.targetMap.get(name)
    return this.menusList.get(menuTarget!)
  }

  public getMenus(): MenuType[] {
    const res: MenuType[] = []
    this.targetMap.forEach(target => {
      const menu = this.menusList.get(target)
      if (menu != null) {
        res.push(menu)
      }
    })
    return res
  }
}

export default Menus
