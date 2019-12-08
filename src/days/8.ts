import { getAocDataForDay } from '../utils/aocApiService'

// ==============================================================================================================
// exports
// ==============================================================================================================
export function main () {
  const items = getAocDataForDay(8)
  .split('')
  .map(Number)

  console.log(`answer for part 1:`, part1(items, 6, 25))
  console.log(`answer for part 2:`, part2(items, 6, 25))
}

export function part1 (items: number[], imageHeight: number, imageWidth: number) {
  const layerSize = imageHeight * imageWidth

  const layers = new Array(items.length / layerSize)
    .fill([])
    .map((_, i) => [...items.slice(i * layerSize, i * layerSize + layerSize) ]) // create rows
    .map(layer => ({
      layer,
      numOfZeroes: layer.filter(x => x === 0).length,
      numOfOnes: layer.filter(x => x === 1).length,
      numOfTwos: layer.filter(x => x === 2).length
    }))
    .sort((a, b) => a.numOfZeroes - b.numOfZeroes)

  return layers[0].numOfOnes * layers[0].numOfTwos
}

export function part2 (items: number[], imageHeight: number, imageWidth: number) {
  const layerSize = imageHeight * imageWidth

  const layers = new Array(items.length / layerSize)
    .fill([])
    .map((_, i) => [...items.slice(i * layerSize, i * layerSize + layerSize) ]) // create rows
    // if row is transparent, look to next layer for a color otherwise keep highest layer's color
    .reduce((finalImage, nextLayer) => finalImage.map((pixel, i) => pixel < 2 ? pixel : nextLayer[i]), new Array(layerSize).fill(2))
    .map((_, i, image) => [...image.slice(i * imageWidth, i * imageWidth + imageWidth) ]) // convert to 2 dimensional array
    .filter(row => row.length) // filter out empty rows

  console.table(layers)
}
