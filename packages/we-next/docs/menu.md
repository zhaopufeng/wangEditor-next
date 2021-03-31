# 菜单模块使用介绍
对于菜单的注册，也进行了重写，在这里也简单介绍各 `API` 的使用。 

每次初始化编辑器，会初始化一个菜单实例在编辑器实例上，可通过 `editor.menus` 访问。

## API
这里简单介绍菜单模块的 `API`以及如何使用。

### registerMenu(name: string, menu: MenuType, config?: any)
使用该 `API` 来注册一个菜单，第一个参数是菜单的名字，第二个参数即具体的菜单实例，**注意，这里的实例是之指已经初始化过的类实例，留意下面的代码示例**，第三个参数即为菜单的一些配置，可选。

下面我们以 `FontColor` 的菜单作为例子来看怎么实现一个菜单并注册：
```js
// 实现一个菜单 FontColor.ts
class FontColor extends DropListMenu implements MenuActive {
  constructor(editor: Editor) {
    const $elem = $(
        `<div class="w-e-menu" data-title="文字颜色">
            <i class="w-e-icon-pencil2"></i>
        </div>`
      )
    const colors = this.getConfig('fontColor.colors') // or this.getConfig(['fontColor', 'colors'])
    const colorListConf = {
      width: 120,
      title: '文字颜色',
      // droplist 内容以 block 形式展示
      type: 'inline-block',
      list: colors.colors.map(color => {
          return {
              $elem: $(`<i style="color:${color};" class="w-e-icon-pencil2"></i>`),
              value: color,
          }
      }),
      clickHandler: (value: string) => {
          // this 是指向当前的 BackColor 对象
          this.command(value)
      },
    }
    super($elem, editor, colorListConf)
  }
  // 省略其它代码
}

// 注册菜单 editor.ts
import FontColor from './FontColor'
const editor = new Wangeditor('#div1')
const fontColor = new FontColor(editor)

editor.menus.registerMenu('fontColor', fontColor, {
  colors: ['#000000', '#eeece0', '#1c487f', '#4d80bf']
})
```
在上面的例子中，有几个需要注意的地方，第一个就是 `this.getConfig('fontColor.colors')`，这个方法是为基类 `Menu` 实现的一个方法，我们所有继承 `Menu` 的菜单类的都会包含这个方法，用来获取菜单配置，而且每个菜单都扩展了 `config` 属性，也就是用户在初始化编辑器菜单配置的时候可能会传入一些配置，具体看 [插件化方案](https://www.yuque.com/wangeditor/mf8eum/gb3cg0) 文章里的”菜单配置一块的内容“，新的菜单可能会这样初始化：
```ts
const foreColorMenu = {
  key: 'foreColor',
  config : {
    colors: [
        '#000000',
        '#eeece0',
        '#1c487f',
        '#4d80bf'
    ]
  }
}

editor.config.menus = [
  'bold',
  foreColorMenu,
  // ...其他菜单...
]
```
这里的 `config` 就会在注册菜单的时候合并到菜单实例的 `config` 属性上。那么问题来了，既然可以通过 `config` 获取到，在上面的例子为什么还需要通过 `getConfig` 拿配置项了？

在我的设计里是为了兼容 `v4` 版本的使用方式，如果你觉得上面这种菜单对象的方式比较麻烦，那么还是可以使用 `v4` 的方式：
```ts
editor.config.colors = [
  '#000000',
  '#eeece0',
  '#1c487f',
  '#4d80bf'
]
```
上面这种方式会覆盖菜单对象初始化的配置，所以尽量保证不要两种方式混用。当然这个方法也可以方便获取其它菜单的配置。

第二个需要注意的是注册菜单的时候第二个参数必须是已经菜单的实例，而不是直接传递构造函数。

### getMenu(name: string): MenuType
该 `API` 用来获取已注册过的菜单，上面我们介绍了如何编写和注册一个菜单，如果要获取已注册过的菜单，代码如下：

```ts
const fontColor = editor.menus.getMenu('fontColor')
// 使用
console.log(fontColor.config)
```

### hasMenu(name: string): boolean
该 `API` 用来判断某个菜单名是否已经被注册，如果已注册返回 `true`。

### getMenus(): MenuType
获取已注册的所有菜单。



