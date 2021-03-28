/**
 * @description Text 事件钩子函数。Text 公共的，不是某个菜单独有的
 * @wangfupeng
 */

import Text from '../index'
import deleteToKeepP from './del-to-keep-p'
import tabToSpan from './tab-to-space'

/**
 * 初始化 text 事件钩子函数
 * @param text text 实例
 */
function initTextHooks(text: Text): void {
    const editor = text.editor
    const eventHooks = text.eventHooks

    // 删除时，保留 EMPTY_P
    deleteToKeepP(editor, eventHooks.deleteUpEvents, eventHooks.deleteDownEvents)

    // tab 转换为空格
    tabToSpan(editor, eventHooks.tabDownEvents)
}

export default initTextHooks
