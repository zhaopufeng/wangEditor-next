/**
 * @description 编辑区域，入口文件
 * @author wangfupeng
 */

import $ from '../utils/dom-core'
import Editor from "../editor"
import { throttle, UA } from "../utils/util"
import { EMPTY_P, EMPTY_P_LAST_REGEX, EMPTY_P_REGEX } from "../utils/const"
import initEventHooks from './event-hooks/index'

/** 按键函数 */
type KeyBoardHandler = (event: KeyboardEvent) => unknown
/** 普通事件回调 */
type EventHandler = (event?: Event) => unknown
// 各个事件钩子函数
export type TextEventHooks = {
    onBlurEvents: EventHandler[]
    changeEvents: (() => void)[] // 内容修改时
    clickEvents: EventHandler[]
    keydownEvents: KeyBoardHandler[]
    keyupEvents: KeyBoardHandler[]
    pasteEvents: ((e: ClipboardEvent) => void)[]
    textScrollEvents: EventHandler[]
    /** tab 键（keyCode === ）Up 时 */
    tabUpEvents: KeyBoardHandler[]
    /** tab 键（keyCode === 9）Down 时 */
    tabDownEvents: KeyBoardHandler[]
    /** enter 键（keyCode === 13）up 时 */
    enterUpEvents: KeyBoardHandler[]
    /** enter 键（keyCode === 13）down 时 */
    enterDownEvents: KeyBoardHandler[]
    /** 删除键（keyCode === 8）up 时 */
    deleteUpEvents: KeyBoardHandler[]
    /** 删除键（keyCode === 8）down 时 */
    deleteDownEvents: KeyBoardHandler[]
}

class Text {
    public editor: Editor
    public eventHooks: TextEventHooks // Text 各个事件的钩子函数，如 keyup 时要执行哪些函数

    constructor(editor: Editor) {
        this.editor = editor

        this.eventHooks = {
            onBlurEvents: [],
            changeEvents: [],
            clickEvents: [],
            keydownEvents: [],
            keyupEvents: [],
            pasteEvents: [],
            textScrollEvents: [],
            tabUpEvents: [],
            tabDownEvents: [],
            enterUpEvents: [],
            enterDownEvents: [],
            deleteUpEvents: [],
            deleteDownEvents: [],
        }
    }

    /**
     * 初始化
     */
    public init(): void {
        // 实时保存选取范围
        this._saveRange()

        // 绑定事件
        this._bindEventHooks()

        // 初始化 text 事件钩子函数
        initEventHooks(this)
    }

    /**
     * 切换placeholder
     */
    public togglePlaceholder(): void {
        const html = this.html()
        const $placeholder = this.editor.$textContainerElem.find('.placeholder')
        $placeholder.hide()
        if (!html || html === ' ') $placeholder.show()
    }

    /**
     * 清空内容
     */
    public clear(): void {
        this.html(EMPTY_P)
    }

    /**
     * 设置/获取 html
     * @param val html 字符串
     */
    public html(val?: string): void | string {
        const editor = this.editor
        const $textElem = editor.$textElem

        // 没有 val ，则是获取 html
        if (val == null) {
            let html = $textElem.html()
            // 去掉空行
            html = html.replace(/<p><\/p>/gim, '')
            // 去掉最后的 空标签
            html = html.replace(EMPTY_P_LAST_REGEX, '')
            // 为了避免用户在最后生成的EMPTY_P标签中编辑数据, 最后产生多余标签, 去除所有p标签上的data-we-empty-p属性
            html = html.replace(EMPTY_P_REGEX, '<p>')

            /**
             * 这里的代码为了处理火狐多余的空行标签,但是强制删除空行标签会带来其他问题
             * html()方法返回的的值,EMPTY_P中pr会被删除,只留下<p>,点不进去,从而产生垃圾数据
             * 目前在末位有多个空行的情况下执行撤销重做操作,会产生一种不记录末尾空行的错觉
             * 暂时注释, 等待进一步的兼容处理
             */
            // html = html.replace(/><br>(?!<)/gi, '>') // 过滤 <p><br>内容</p> 中的br
            // html = html.replace(/(?!>)<br></gi, '<') // 过滤 <p>内容<br></p> 中的br

            /**
             * pre标签格式化
             * html()方法理论上应当输出纯净的代码文本,但是对于是否解析html标签还没有良好的判断
             * 如果去除hljs的标签,在解析状态下回显,会造成显示错误并且无法再通过hljs方法渲染
             * 暂且其弃用
             */
            // html = formatCodeHtml(editor, html)

            // TODO: 可以接收外界插件，对html进行过滤/加工
            // 如：val = editor.plugin.transform.reduce((cur, render) => render(cur), val)
            return html
        }

        // 有 val ，则是设置 html
        val = val.trim()

        // TODO: 针对不同的html，插件可能会做不同的处理。
        // 如：val = editor.plugin.render.reduce((cur, render) => render(cur), val)

        if (val === '') {
            val = EMPTY_P
        }
        if (val.indexOf('<') !== 0) {
            // 内容用 p 标签包裹
            val = `<p>${val}</p>`
        }
        val = val.replace(/\s+</g, '<')
        $textElem.html(val)

        // 初始化选区，将光标定位到内容尾部
        // 原editor上有initSelection，现在没有了，会导致报错，暂时注释掉
        // editor.initSelection()
    }

    /**
     * 设置 字符串内容
     * @param val text 字符串
     */
    public text(val: string): void
    /**
     * 获取 字符串内容
     */
    public text(): string
    public text(val?: string): void | string {
        const editor = this.editor
        const $textElem = editor.$textElem

        // 没有 val ，是获取 text
        if (val == null) {
            let text = $textElem.text()
            // TODO: 可以接收外界插件，对text进行过滤/加工
            // text = editor.plugin.transform.reduce((cur, render) => render(cur), text)
            return text
        }

        // TODO: 可以接收外界插件，对text进行过滤/加工
        // 如：val = editor.plugin.transform.reduce((cur, render) => render(cur), val)
        // 有 val ，则是设置 text
        $textElem.text(`<p>${val}</p>`)

        // 初始化选区，将光标定位到内容尾部
        // 原editor上有initSelection，现在没有了，会导致报错，暂时注释掉
        // editor.initSelection()
    }

    /**
     * 追加 html 内容
     * @param html html 字符串
     */
    public append(html: string): void {
        const editor = this.editor
        if (html.indexOf('<') !== 0) {
            // 普通字符串，用 <p> 包裹
            html = `<p>${html}</p>`
        }
        this.html(this.html() + html)
        // 初始化选区，将光标定位到内容尾部
        // 原editor上有initSelection，现在没有了，会导致报错，暂时注释掉
        // editor.initSelection()
    }

    /**
     * 每一步操作，都实时保存选区范围
     */
    private _saveRange(): void {
        const editor = this.editor
        const $textElem = editor.$textElem
        const $document = $(document)

        // 保存当前的选区
        function saveRange() {
            // 随时保存选区
            editor.selection.saveRange()
            // 更新按钮 active 状态
            // 暂无menu, 因此注释，根据后续项目变化来进行修改。
            // editor.menus.changeActive()
        }

        // 按键后保存
        $textElem.on('keyup', saveRange)

        // 点击后保存，为了避免被多次执行而导致造成浪费，这里对 click 使用一次性绑定
        function onceClickSaveRange() {
            saveRange()
            $textElem.off('click', onceClickSaveRange)
        }
        $textElem.on('click', onceClickSaveRange)

        function handleMouseUp() {
            // 在编辑器区域之外完成抬起，保存此时编辑区内的新选区，取消此时鼠标抬起事件
            saveRange()
            $document.off('mouseup', handleMouseUp)
        }
        function listenMouseLeave() {
            // 当鼠标移动到外面，要监听鼠标抬起操作
            $document.on('mouseup', handleMouseUp)
            // 首次移出时即接触leave监听，防止用户不断移入移出多次注册handleMouseUp
            $textElem.off('mouseleave', listenMouseLeave)
        }
        $textElem.on('mousedown', () => {
            // mousedown 状态下，要坚听鼠标滑动到编辑区域外面
            $textElem.on('mouseleave', listenMouseLeave)
        })

        $textElem.on('mouseup', (e: MouseEvent) => {
            // 记得移除$textElem的mouseleave事件, 避免内存泄露
            $textElem.off('mouseleave', listenMouseLeave)

            const selection = editor.selection
            const range = selection.getRange()

            if (range === null) return

            saveRange()
        })
    }

    /**
     * 绑定事件，事件会触发钩子函数
     */
    private _bindEventHooks(): void {
        const editor = this.editor
        const $textElem = editor.$textElem
        const eventHooks = this.eventHooks

        // click hooks
        $textElem.on('click', (e: Event) => {
            const clickEvents = eventHooks.clickEvents
            clickEvents.forEach(fn => fn(e))
        })

        // 键盘 up 时的 hooks
        $textElem.on('keyup', (e: KeyboardEvent) => {
            const keyupEvents = eventHooks.keyupEvents
            keyupEvents.forEach(fn => fn(e))
        })

        // 键盘 down 时的 hooks
        $textElem.on('keydown', (e: KeyboardEvent) => {
            const keydownEvents = eventHooks.keydownEvents
            keydownEvents.forEach(fn => fn(e))
        })

        // 粘贴
        $textElem.on('paste', (e: ClipboardEvent) => {
            if (UA.isIE()) return // IE 不支持

            // 阻止默认行为，使用 execCommand 的粘贴命令
            e.preventDefault()

            const pasteEvents = eventHooks.pasteEvents
            pasteEvents.forEach(fn => fn(e))
        })

        // enter 键 up 时的 hooks
        $textElem.on('keyup', (e: KeyboardEvent) => {
            if (e.keyCode !== 13) return
            const enterUpEvents = eventHooks.enterUpEvents
            enterUpEvents.forEach(fn => fn(e))
        })

        // enter 键 down
        $textElem.on('keydown', (e: KeyboardEvent) => {
            if (e.keyCode !== 13) return
            const enterDownEvents = eventHooks.enterDownEvents
            enterDownEvents.forEach(fn => fn(e))
        })

        // delete 键 up 时 hooks
        $textElem.on('keyup', (e: KeyboardEvent) => {
            if (e.keyCode !== 8) return
            const deleteUpEvents = eventHooks.deleteUpEvents
            deleteUpEvents.forEach(fn => fn(e))
        })

        // delete 键 down 时 hooks
        $textElem.on('keydown', (e: KeyboardEvent) => {
            if (e.keyCode !== 8) return
            const deleteDownEvents = eventHooks.deleteDownEvents
            deleteDownEvents.forEach(fn => fn(e))
        })

        // tab up
        $textElem.on('keyup', (e: KeyboardEvent) => {
            if (e.keyCode !== 9) return
            e.preventDefault()
            const tabUpEvents = eventHooks.tabUpEvents
            tabUpEvents.forEach(fn => fn(e))
        })

        // tab down
        $textElem.on('keydown', (e: KeyboardEvent) => {
            if (e.keyCode !== 9) return
            e.preventDefault()
            const tabDownEvents = eventHooks.tabDownEvents
            tabDownEvents.forEach(fn => fn(e))
        })

        // 文本编辑区域 滚动时触发
        $textElem.on(
            'scroll',
            // 使用节流
            throttle((e: Event) => {
                const textScrollEvents = eventHooks.textScrollEvents
                textScrollEvents.forEach(fn => fn(e))
            }, 100)
        )
    }
}

export default Text
