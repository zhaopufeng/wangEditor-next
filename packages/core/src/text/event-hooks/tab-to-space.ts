/**
 * @description 编辑区域 tab 的特殊处理
 * @author wangfupeng
 */

import Editor from '../../editor/index'

/**
 * 编辑区域 tab 的特殊处理，转换为空格
 * @param editor 编辑器实例
 * @param tabDownEvents tab down 事件钩子
 */
function tabHandler(editor: Editor, tabDownEvents: Function[]) {
    // 定义函数
    function fn() {
        editor.cmd.do('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;')
    }

    // 保留函数
    tabDownEvents.push(fn)
}

export default tabHandler
