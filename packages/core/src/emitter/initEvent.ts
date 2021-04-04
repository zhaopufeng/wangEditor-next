import Editor from '../editor'
import $ from '../utils/dom-core'

/**
 * 阻止默认事件
 */
function preventDefault(e: Event) {
  e.preventDefault()
}

export default function initEvents(editor: Editor) {
  const emitter = editor.emitter
  const $textElem = editor.$textElem
  // const $textContainerElem = editor.$textContainerElem
  const $toolbarElem = editor.$toolbarElem

  // 编辑区域事件钩子
  $textElem.on('click', (e: Event) => emitter.emit('text:click', e))
  $textElem.on('keyup', (e: KeyboardEvent) => emitter.emit('text:keyup', e))
  $textElem.on('keydown', (e: KeyboardEvent) => emitter.emit('text:keydown', e))
  $textElem.on('paste', (e: ClipboardEvent) => emitter.emit('text:paste', e))
  $textElem.on('scroll', (e: Event) => emitter.emit('text:scroll', e))
  $textElem.on('drop', (e: Event) => emitter.emit('text:drop', e))

  // 编辑区域容器事件钩子
  // $textContainerElem.on()

  // 菜单栏事件钩子
  $toolbarElem.on('click', (e: Event) => emitter.emit('menu:click', e))

  // 禁用 document 拖拽事件
  $(document)
    .on('dragleave', preventDefault)
    .on('drop', preventDefault)
    .on('dragenter', preventDefault)
    .on('dragover', preventDefault)

  // 解禁 document 拖拽事件
  emitter.on('hook:beforeDestroy', () => {
    $(document)
      .off('dragleave', preventDefault)
      .off('drop', preventDefault)
      .off('dragenter', preventDefault)
      .off('dragover', preventDefault)
  })
}
