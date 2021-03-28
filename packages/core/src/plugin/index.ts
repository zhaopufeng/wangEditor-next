/**
 * @description 插件管理
 * @author luochao
 */

type PluginTarget = {
  __isPlugin: boolean
  name: string
}

export default class Plugin {
  private plugins: WeakMap<PluginTarget, any>
  private targetMap: Map<string, PluginTarget>

  constructor() {
    this.plugins = new WeakMap()
    this.targetMap = new Map()
  }

  public registerPlugin(name: string, plugin: any): void {
    if (this.hasPlugin(name)) {
      throw new Error('该插件名已使用，请使用其它的名称')
    }
    const pluginTarget: PluginTarget = {
      __isPlugin: true,
      name,
    }
    this.plugins.set(pluginTarget, plugin)
    this.targetMap.set(name, pluginTarget)
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
