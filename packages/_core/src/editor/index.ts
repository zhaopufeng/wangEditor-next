/**
 * @description 编辑器
 * @author tonghan
 */

import { Dom7 } from "dom7"
import { Emitter } from "../emitter"

export type Selector = 
    string |
    Document |
    Element |
    HTMLElement |
    HTMLElement[] |
    HTMLCollection |
    Node |
    NodeList |
    ChildNode |
    ChildNode[] |
    EventTarget

export type ToolbarSelector = Selector
export type TextSelector = Selector | null | undefined



export default class Editor {
    public $: Dom7 // 元素操作
    public emitter: Emitter // 发射器


    /**
     * 构造函数
     * @param toolbarSelector 工具栏 DOM selector
     * @param textSelector 文本区域 DOM selector
     */
    constructor() {
        // 初始化发射器
        // const $ = this.$ = initDomCore()
        // const emitter = this.emitter = initEmitter()

        // this.$textElem = $('<div></div>')
        // this.$toolbarElem = $('<div></div>')
        // this.$textContainerElem = $('<div></div>')
    }
}
