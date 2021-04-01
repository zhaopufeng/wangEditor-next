/**
 * @description 编辑器 class
 * @author tonghan
*/

import $, { DomElement, DomElementSelector } from '../utils/dom-core'
import { EMPTY_P } from '../utils/const'
import config, { WangEditorConfig } from '../config'
import logger, { TLogger } from '../utils/logger'
import SelectionAndRangeAPI from '../selection'
import CommandAPI from '../command'
import initEvents from '../emitter/initEvent'
import createEmitter, { Emitter } from '../utils/emitter'
import createEditorElement from '../element'
import Plugin from '../plugin'

// 菜单
import Menu, { MenuListType } from '../menus'

import BtnMenu from '../menus/constructor/BtnMenu'
import DropList from '../menus/constructor/DropList'
import DropListMenu from '../menus/constructor/DropListMenu'
import Panel from '../menus/constructor/Panel'
import PanelMenu from '../menus/constructor/PanelMenu'
import Tooltip from '../menus/constructor/Tooltip'

let EDITOR_ID = 1



/**
 * 菜单注册
 * @param { string } key 菜单名称
 * @param { Function } Menu 菜单的构造函数
 * @param { string } target 保存的目标
*/
function registerMenu(key: string, Menu: FunctionConstructor, target: MenuListType, logger?: TLogger | Console) {
    logger = logger ? logger : console

    if (!Menu || typeof Menu !== 'function') {
        throw TypeError('Menu is not function')
    }

    if(target[key]) {
        logger.warn('register menu repeat:', key)
    }

    target[key] = Menu
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

    static globalCustomMenuConstructorList: MenuListType = {}
    public customMenuConstructorList: MenuListType = {}

    public id: string
    public config: WangEditorConfig
    public toolbarSelector: DomElementSelector
    public textSelector?: DomElementSelector
    public $toolbarElem: DomElement
    public $textContainerElem: DomElement
    public $textElem: DomElement
    public cmd: CommandAPI
    public selection: SelectionAndRangeAPI
    public menu: Menu
    public logger: TLogger
    public emitter: Emitter
    public plugin: Plugin

    /**
     * 自定义添加菜单 - 全局 - 静态方法
     * @param { string } key 菜单名称
     * @param { Function } Menu 菜单的构造函数
    */
     static registerMenu(key: string, Menu: any) {
        registerMenu(key, Menu, Editor.globalCustomMenuConstructorList)
    }

    /**
     * 自定义添加菜单 - 实例
     * @param { string } key 菜单名称
     * @param { any } Menu 菜单的构造函数
    */
    public registerMenu(key: string, Menu: any) {
        registerMenu(key, Menu, this.customMenuConstructorList, this.logger)
    }

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

        // 配置项初始化
        this.config = config

        // 元素节点初始化
        this.$toolbarElem = $('<div></div>')
        this.$textContainerElem = $('<div></div>')
        this.$textElem = $('<div></div>')

        // 记录器创建
        this.logger = logger()

        // 发射器创建
        this.emitter = createEmitter()

        // 命令创建
        this.cmd = new CommandAPI(this)

        // 选择创建
        this.selection = new SelectionAndRangeAPI(this)
        
        // 菜单创建
        this.menu = new Menu()

        // 插件的初始化准备
        this.plugin = new Plugin()

        // 注册一个插件
        // this.plugin.registerPlugin('i18n', i18n)
    }

    /**
     * 创建编辑器实例
     */
    public create(): void {
        // 触发 created 生命周期
        this.emitter.emit('hook:beforeCreate')

        // 初始化 DOM
        createEditorElement(this)

        // 初始化菜单
        this.menu.init(this)

        // TODO
        // 插件的初始化

        // 将光标定位到编辑区域尾部
        this.selection.rangeToEnd()

        // 事件初始化
        initEvents(this)

        // 触发 mounted 生命周期
        this.emitter.emit('hook:created')
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
