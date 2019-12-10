import fs from 'fs'

export function getAocDataForDay (dayNum: number | string) {
  return fs.readFileSync(`${__dirname}/../data/${dayNum}.txt`, 'utf8')
}
