/**
 * @description 文本处理
 * @author tonghan
*/

import Editor from "../editor";

import { EMPTY_P, EMPTY_P_LAST_REGEX, EMPTY_P_REGEX } from '../utils/const'

class TextHandler {

    private editor: Editor

    /**
     * 构造函数
    */
    constructor(editor: Editor) {
        this.editor = editor
    }
    
    /**
     * 初始化
    */
    public init(): void {}

    /**
     * 设置/获取 html
     * @param { string } val html 字符串
    */
    public html(): string
    public html(val: string): void
    public html(val?: string): void | string {
        const editor = this.editor
        const $textElem = editor.$textElem

        // 没有 val ，则是获取 html
        if (val === null || val === undefined) {
            let html = $textElem.html()
            // 未选中任何内容的时候点击“加粗”或者“斜体”等按钮，就得需要一个空的占位符 &#8203 ，这里替换掉
            html = html.replace(/\u200b/gm, '')
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

            // 将没有自闭和的标签过滤为自闭和
            const selfCloseHtmls: RegExpMatchArray | null = html.match(/<(img|br|hr|input)[^>]*>/gi)
            if (selfCloseHtmls !== null) {
                selfCloseHtmls.forEach(item => {
                    if (!item.match(/\/>/)) {
                        html = html.replace(item, item.substring(0, item.length - 1) + '/>')
                    }
                })
            }

            return html
        } 
        
        // 有 val ，则是设置 html
        else {
            // 祛除空格
            val = val.trim()
            
            // 处理 val 的值
            val = val === '' ? val : EMPTY_P

            // 当 val 没有被标签包裹的时候，设置 p 标签
            if (!val.includes('<')) {
                val = `<p>${val}</p>`
            }

            // 删除 val 当中 < 前多余的空白符号
            val = val.replace(/\s+</g, '<')

            // 填入编辑区域
            $textElem.html(val)

            // 将光标定位到编辑区域尾部
            editor.selection.rangeToEnd()
        }
    }

    /**
     * 设置/获取 text
     * @param { string } val html 字符串
    */
    public text(): string
    public text(val: string): void
    public text(val?: string): void | string {
        const editor = this.editor
        const $textElem = editor.$textElem

        // 没有 val ，是获取 text
        if (val === null || val === undefined) {
            let text = $textElem.text()
            // 未选中任何内容的时候点击“加粗”或者“斜体”等按钮，就得需要一个空的占位符 &#8203 ，这里替换掉
            text = text.replace(/\u200b/gm, '')
            return text
        } 
        
        // 有 val ，则是设置 text
        else {
            // 填入编辑区域
            $textElem.text(`<p>${val}</p>`)

            // 将光标定位到编辑区域尾部
            editor.selection.rangeToEnd()
        }
    }

    /**
     * 追加 html 内容
     * @param html html 字符串
    */
    public append(val: string): void {
        // 当 val 没有被标签包裹的时候，设置 p 标签
        if (!val.includes('<')) {
            val = `<p>${val}</p>`
        }

        // 填入编辑区域
        this.html(this.html() + val)

        // 将光标定位到编辑区域尾部
        this.editor.selection.rangeToEnd()
    }

    /**
     * 重置编辑区域的内容
    */
    public reset(): void {
        this.html(EMPTY_P)
    }
}

export default TextHandler
