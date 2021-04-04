/**
 * @description 插件管理
 * @author luochao
 */
import Editor from '../editor'

type PluginTarget = {
  __isPlugin: boolean
  name: string
}

type PluginFn = {
  (editor: Editor, config?: any): any
}

export default class Plugin {
  private plugins: WeakMap<PluginTarget, any>
  private targetMap: Map<string, PluginTarget>
  public editor: Editor

  constructor(editor: Editor) {
    this.plugins = new WeakMap()
    this.targetMap = new Map()
    this.editor = editor
  }

  public registerPlugin(name: string, pluginFn: PluginFn, config?: any): Plugin {
    if (this.hasPlugin(name)) {
      throw new Error('该插件名已使用，请使用其它的名称')
    }
    const pluginTarget: PluginTarget = {
      __isPlugin: true,
      name,
    }
    const pluginRes = pluginFn(this.editor, config)
    this.plugins.set(pluginTarget, pluginRes)
    this.targetMap.set(name, pluginTarget)
    return this
  }

  public hasPlugin(name: string): boolean {
    const pluginTarget = this.targetMap.get(name)
    return !!pluginTarget
  }

  public usePlugin(name: string): any {
    if (!this.hasPlugin(name)) {
      throw new Error('该插件不存在，请传入正确的插件名称')
    }
    const pluginTarget = this.targetMap.get(name)
    return this.plugins.get(pluginTarget!)
  }
}
