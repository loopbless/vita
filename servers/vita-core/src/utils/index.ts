import { customAlphabet, nanoid } from 'nanoid'

export function uuid(len = 16) {
  const alphabet = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890')
  return alphabet(len)
}

export { nanoid }