// @ts-ignore
import { AES } from 'crypto-es/lib/aes.js'

export default function weA(key: string, data: any) {
  return AES.encrypt(JSON.stringify(data), key).toString()
}
