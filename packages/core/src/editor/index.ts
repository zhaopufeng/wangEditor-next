/**
 * @description 编辑器 class
 * @author wangfupeng
 */

import $, { DomElement, DomElementSelector } from '../utils/dom-core'
import { EMPTY_P } from '../utils/const'
import config, { WangEditorConfig } from '../config'
import logger, { TLogger } from '../utils/logger'
import SelectionAndRangeAPI from '../selection'
import CommandAPI from '../command'
import createEmitter, { Emitter } from '../emitter'
import createEditorElement from '../element'


// 菜单
import BtnMenu from '../menus/BtnMenu'
import DropList from '../menus/DropList'
import DropListMenu from '../menus/DropListMenu'
import Panel from '../menus/Panel'
import PanelMenu from '../menus/PanelMenu'
import Tooltip from '../menus/Tooltip'
import initEvents from '../element/initEvent'


let EDITOR_ID = 1

/**
 * 初始化 selector range
*/
function initSelection(editor: Editor, newLine: boolean = false) {
    const $textElem = editor.$textElem
    const $children = $textElem.children()
    if (!$children || !$children.length) {
        // 如果编辑器区域无内容，添加一个空行，重新设置选区
        $textElem.append($(EMPTY_P))
        initSelection(editor)
        return
    }

    const $last = $children.last()

    if (newLine) {
        // 新增一个空行
        const html = $last.html().toLowerCase()
        const nodeName = $last.getNodeName()
        if ((html !== '<br>' && html !== '<br/>') || nodeName !== 'P') {
            // 最后一个元素不是 空标签，添加一个空行，重新设置选区
            $textElem.append($(EMPTY_P))
            initSelection(editor)
            return
        }
    }

    editor.selection.createRangeByElem($last, false, true)
    if (editor.config.focus) {
        editor.selection.restoreSelection()
    } else {
        // 防止focus=false受其他因素影响
        editor.selection.clearWindowSelectionRange()
    }
}

class Editor {
    // 暴露 $
    static $ = $

    static BtnMenu = BtnMenu
    static DropList = DropList
    static DropListMenu = DropListMenu
    static Panel = Panel
    static PanelMenu = PanelMenu
    static Tooltip = Tooltip

    public id: string
    public config: WangEditorConfig
    public toolbarSelector: DomElementSelector
    public textSelector?: DomElementSelector
    public $toolbarElem: DomElement
    public $textContainerElem: DomElement
    public $textElem: DomElement
    public selection: SelectionAndRangeAPI
    public cmd: CommandAPI
    public logger: TLogger
    public emitter: Emitter

    /**
     * 构造函数
     * @param toolbarSelector 工具栏 DOM selector
     * @param textSelector 文本区域 DOM selector
     */
    constructor(toolbarSelector: DomElementSelector, textSelector?: DomElementSelector) {
        // id，用以区分单个页面不同的编辑器对象
        this.id = `wangEditor-${EDITOR_ID++}`

        this.toolbarSelector = toolbarSelector
        this.textSelector = textSelector

        if (toolbarSelector == null) {
            throw new Error('错误：初始化编辑器时候未传入任何参数，请查阅文档')
        }

        this.config = config

        this.$toolbarElem = $('<div></div>')
        this.$textContainerElem = $('<div></div>')
        this.$textElem = $('<div></div>')

        this.logger = logger()
        this.emitter = createEmitter()
        this.cmd = new CommandAPI(this)
        this.selection = new SelectionAndRangeAPI(this)

        // TODO
        // 菜单的初始化准备
        
        // TODO
        // 插件的初始化准备

    }

    /**
     * 创建编辑器实例
     */
    public create(): void {
        // 触发 create 生命周期
        this.emitter.emit('hook:create')

        // 初始化 DOM
        createEditorElement(this)

        // TODO
        // 初始化菜单

        // TODO
        // 插件的初始化
        

        // 初始化选区，将光标定位到内容尾部
        initSelection(this)

        // 事件初始化 
        initEvents(this)
        
        // 触发 mounted 生命周期
        this.emitter.emit('hook:mounted')
    }

    /**
     * 销毁当前编辑器实例
     */
    public destroy(): void {
        // 触发 beforeDestroy 生命周期
        this.emitter.emit('hook:beforeDestroy')

        // 销毁 DOM 节点
        this.$toolbarElem.remove()
        this.$textContainerElem.remove()
    }
}

export default Editor
 