/**
 * @description 发射器 Emitter
 * @author tonghan
 */
import mitt, { Emitter as MittEmitter } from 'mitt'

export type Emitter = MittEmitter

/**
 * 创建发射器
 * @returns { Emitter } 发射器
 */
export default function createEmitter(): Emitter {
  return mitt()
}
