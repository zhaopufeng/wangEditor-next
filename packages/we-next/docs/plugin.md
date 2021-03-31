# 插件简单使用介绍
为了方便扩展插件的功能，还是抽离了一个单独的插件模块管理插件注册和存放所有插件，目前代码在 `core` 代码库下的 `plugin` 目录下。

每次初始化编辑器，会初始化一个插件实例在编辑器实例上，可通过 `editor.plugin` 访问。

## API
这里简单介绍插件模块的 `API`以及如何使用。

### registerPlugin(name: string, fn: (editor, config) => any, config?: any)
使用该 `API` 来注册一个插件，第一个参数是插件的名字，第二个参数即用户具体实现插件逻辑的部分，第三个参数即为插件的一些配置，可选。

下面我们以 `i18n` 的例子来看怎么实现一个插件：
```typescript
// 实现一个插件 i18nPlugin.ts
import i18next from 'i18next'

function i18nPlugin (editor: Editor, config: any) {
  const { defaultLocale, locales } = config

  i18next.init({
    lng: defaultLocale,
    resources: locales
  })

  return i18next
}

// 注册插件 editor.ts
const editor = new Wangeditor('#div1')
editor.plugin.registerPlugin('i18n', i18nPlugin, { default: 'en', locales: {
  en: {
    wangEditor: {
        请输入正文: 'please input text',
    }
  },
  zhCn: {
    wangEditor: {
        请输入正文: '请输入正文',
    }
  }
}})
```
### usePlugin(name: string): any
该 `API` 用来获取已注册过的插件，上面我们介绍了如何编写和注册一个插件，如果要使用注册过的插件，代码如下：

```typescript
const i18n = editor.plugin.usePlugin('i18n')
// 使用
i18n.t('请输入正文')
```

### hasPlugin(name: string): boolean
该 `API` 用来判断某个插件名是否已经被注册，如果已注册返回 `true`。



