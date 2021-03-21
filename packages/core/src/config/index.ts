/**
 * @description 编辑器配置
 * @author wangfupeng
 */

import cmd, { ICmd } from './cmd'
import text, { IText } from './text'

export type WangEditorConfig = ICmd & IText

const config: WangEditorConfig = Object.assign({}, cmd, text)

export default config
