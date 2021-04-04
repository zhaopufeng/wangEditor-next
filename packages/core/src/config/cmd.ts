/**
 * @description 命令配置项
 * @author wangfupeng
 */

export interface ICmd {
  styleWithCSS: boolean
}

export default (function (): ICmd {
  return { styleWithCSS: false }
})()
