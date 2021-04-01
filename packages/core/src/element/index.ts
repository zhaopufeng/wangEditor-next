/**
 * @description element
 * @author tonghan
 */


import Editor from '../editor';
import { EMPTY_P } from '../utils/const';
import { DomElement } from '../utils/dom-core';
import { getRandom } from '../utils/util';

export const styleSettings = {
    border: '1px solid #c9d8db',
    toolbarBgColor: '#FFF',
    toolbarBottomBorder: '1px solid #EEE',
}

/**
 * 创建编辑器元素
 * @param { Editor } editor 编辑器实例
 */
export default function createEditorElement (editor: Editor) {
    const $ = Editor.$

    const $toolbar: DomElement = editor.$toolbarElem
    const $text: DomElement = editor.$textElem
    const $textContainer: DomElement = editor.$textContainerElem

    const height: number = editor.config.height

    let $children: DomElement | null
    
    // 传入了编辑区域的选择器
    if(editor.textSelector) {
        // 获取工具栏容器
        const $toolbarSelector: DomElement = $(editor.toolbarSelector)

        // 把工具栏插入工具栏容器
        $toolbarSelector.append($toolbar)

        // 获取编辑区域容器
        const $textSelector: DomElement = $(editor.textSelector)
        
        // 获取编辑区域下的内容
        $children = $textSelector.children()

        // 把编辑区域容器(自有)填入编辑区域容器(传入)
        $textSelector.append($textContainer)
    }
    
    // 没有传入编辑区域的选择器
    else {
        // 获取编辑器容器
        const $editContainer = $(editor.toolbarSelector)

        // 将编辑器容器原有的内容，暂存起来
        $children = $editContainer.children()

        // 添加工具栏到编辑器容器
        $editContainer.append($toolbar)

        // 设置工具栏的样式
        $toolbar
            .css('background-color', styleSettings.toolbarBgColor)
            .css('border', styleSettings.border)
            .css('border-bottom', styleSettings.toolbarBottomBorder)

        // 设置编辑区域容器的样式
        $textContainer
            .css('border', styleSettings.border)
            .css('border-top', 'none')
            .css('height', `${height}px`)
    }

    // 设置编辑区域的属性和样式
    $text
        .attr('contenteditable', 'true')
        .css('width', '100%')
        .css('height', '100%')

    // placeholder
    const $placeholder = $(`<div>${ editor.config.placeholder }</div>`)
        .addClass('placeholder')

    // 处理编辑区域的内容
    if($children) {
        // 当有 childrens 的时候，将 childrens 塞入 编辑区域
        $text.append($children)

        // 隐藏 placeholder
        $placeholder.hide()
    } else {
        // 塞入默认的空段落
        $text.append($(EMPTY_P))
    }

    // 编辑区域样式和属性设置
    $text
        .addClass('w-e-text')
        .attr('id', getRandom('text-elem'))

    // 编辑区域容器子节点和样式设置
    $textContainer
        .append($text)
        .append($placeholder)
        .addClass('w-e-text-container')
        
    // 工具栏样式和属性设置
    $toolbar
        .addClass('w-e-toolbar')
        .attr('id', getRandom('toolbar-elem'))

    // 判断编辑区与容器高度是否一致
    const textContainerHeight = $textContainer.getBoundingClientRect().height
    const textClientHeight = $text.getBoundingClientRect().height
    if (textContainerHeight !== textClientHeight) {
        $text.css('min-height', textContainerHeight + 'px')
    }
}
