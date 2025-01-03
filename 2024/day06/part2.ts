// const input = (await new Response(Deno.stdin.readable).text()).trim();
// const inputFile = import.meta.dirname + "/sample.txt"
const inputFile = import.meta.dirname + "/input.txt"
const input = Deno.readTextFileSync(inputFile).trim()
const map = input.split("\n").map((line) => line.split(""));

const py = inputFile.includes("sample") ? 6 : 82
const px = inputFile.includes("sample") ? 4 : 34

console.log(map[py][px])

const VISITED = "X"
const OBSTRUCTION = "#"
const EMPTY = "."
const SYMBOLS_DIRECTION = {
  [[-1, 0].toString()]: "^",
  [[0, 1].toString()]: ">",
  [[1, 0].toString()]: "v",
  [[0, -1].toString()]: "<"
}

const SYMBOLS_ROTATION = {
  [[-1, 0].toString()]: "┌",
  [[0, 1].toString()]: "┐",
  [[1, 0].toString()]: "┘",
  [[0, -1].toString()]: "└"
}
const DIRECTIONS = [
  {y: -1, x: 0},
  {y: 0, x: 1},
  {y: 1, x: 0},
  {y: 0, x: -1}
]
function* mapIterator(map: string[][], py: number, px: number, direction: number) {
  while (true) {
    if (py < 0 || py >= map.length || px < 0 || px >= map[0].length) {
      break
    }
    let ny = py + DIRECTIONS[direction].y
    let nx = px + DIRECTIONS[direction].x
    const isLast = ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length
    const pc = map[py][px]
    yield {
      direction, py, px, pc, isLast,
      get ny() {
        return py + DIRECTIONS[direction].y
      },
      get nx() {
        return px + DIRECTIONS[direction].x
      },
      get nc() {
        return map[this.ny]?.[this.nx]
      },
      set: (symbol: string) => map[py][px] = symbol,
      set nc(symbol: string) {
        map[this.ny][this.nx] = symbol
      },
      rotate: () => direction = rotate(direction),
      get clonedMap() {
        return [...map.map(line => [...line])]
      }
    }
    ny = py + DIRECTIONS[direction].y
    nx = px + DIRECTIONS[direction].x
    py = ny
    px = nx
  }
}

class Guard {
  constructor(public py: number, public px: number) {}
}

function* patrolling(it: ReturnType<typeof mapIterator>) {
  for (const rec of it) {
    if (rec.nc === OBSTRUCTION) {
      rec.rotate()
      if (rec.nc === OBSTRUCTION) {
        rec.rotate()
      }
    }
    yield rec
  }
}

// patrolling(mapIterator(map, py, px))
// -1, 0
//  0, 1
//  1, 0
//  0, -1

function rotate(direction: number) {
  return (direction + 1) % 4
}

function hasLoop(it: ReturnType<typeof mapIterator>) {
  const visited = new Set()
  let map
  for (const rec of it) {
    map = map ?? rec.clonedMap
    // if (map[rec.py][rec.px] === VISITED)
    map[rec.py][rec.px] = rec.direction.toString()
    // printMap(map)
    // prompt()
    const key = `${rec.py},${rec.px},${rec.direction}`
    if (visited.has(key)) {
      // map[rec.py][rec.px] = "*"
      return true
    } else {
      visited.add(key)
    }
  }
  return false
}

const printMap = (map: string[][]) => console.clear() ?? console.log(map.map((line) => line.join("")).join("\n"))

let count = 0
const obs = [...map.map(line => [...line])]
const obstructions = new Set()
for (const rec of patrolling(mapIterator(map, py, px, 0))) {
  if (rec.pc !== VISITED) {
    count++
  }
  rec.set(VISITED)
  // printMap(map)
  // console.log(rec.nc)
  // prompt()
  if (!rec.isLast) {
    const clonedMap = rec.clonedMap
    clonedMap[rec.ny][rec.nx] = OBSTRUCTION
    // printMap(clonedMap)
    // prompt()
    if (hasLoop(patrolling(mapIterator(clonedMap, py, px, 0)))) {
      obs[rec.ny][rec.nx] = "0"
      obstructions.add(`${rec.ny},${rec.nx}`)
    }
  }
}
// printMap(obs)
console.log(count, obstructions.size)

// 1944 1939 1888 1883 1866 1721
