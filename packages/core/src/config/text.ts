/**
 * @description 默认常量配置
 * @author xiaokyo
 */

 export interface IText {
    focus: boolean,
    height: number,
    placeholder: string
}

export default (function (): IText {
    return {
        focus: true,
        height: 300,
        placeholder: '请输入正文',
    }
})()