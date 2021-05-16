// @ts-ignore
import { AES } from 'crypto-es/lib/aes.js'
// @ts-ignore
import { Utf8 } from 'crypto-es/lib/core.js'

export default function weB(key: string, encryptData: any) {
  const bytes = AES.decrypt(encryptData, key)
  return JSON.parse(bytes.toString(Utf8))
}
