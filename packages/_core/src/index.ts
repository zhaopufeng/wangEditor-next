/**
 * @description wangEditor
 * @author tonghan
 */

import './utils/polyfill'

import Editor, { Selector, ToolbarSelector, TextSelector } from './editor'
import Logger from './logger'
import createEmitter, { Emitter } from "./emitter"
import SelectionAndRange from './selection'
import Command from './command'


export default class WangEditor {
    private logger: Logger // 记录器
    private emitter: Emitter // 发射器
    private selection: SelectionAndRange
    public editor: Editor // 编辑器

    /**
     * 构造函数
     * @param container 容器选择器
     * @param textSelector 文本区域 DOM selector
     */
    constructor(container: Selector, textSelector?: TextSelector) {
        if(container == null) {
            throw new Error('WangEditor Error: 未传入任何参数，请查阅文档')
        }
        
        this.editor = new Editor()
        this.emitter = createEmitter()
        this.logger = new Logger()
        this.selection = new SelectionAndRange()
        this.cmd = new Command()
    }
}
 