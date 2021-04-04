/**
 * @description 编辑器配置
 * @author wangfupeng
 */

import cmd, { ICmd } from './cmd'
import text, { IText } from './text'
import menus, { IMenus } from './menus'

export type WangEditorConfig = ICmd & IText & IMenus

const config: WangEditorConfig = Object.assign({}, cmd, text, menus)

export default config
