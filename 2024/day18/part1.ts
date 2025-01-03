import PF from "npm:pathfinding";
import { Grid, readInputSync, sleep } from "../lib.ts";

const file = "input";
const slice = file === "sample" ? 12 : 1024;
const width = file === "sample" ? 7 : 71;

const matrix = new Array(width).fill([]).map(() => new Array(width).fill("."));
const grid2 = new Grid(matrix);

const a = [];
a[10] = 10;
a[12] = 12;
a.pop();
// console.log(a.flat(-1));

class Heap {
  list: (number[] | undefined)[] = [];
  size = 0;
  constructor() {}
  push(node: any) {
    const i: number = node.f;
    const set = this.list.at(i) || [];
    set.unshift(node);
    this.list[i] = set;
    this.size++;
  }
  pop() {
    const set = this.list.findLast((s) => s !== undefined);
    const node = set?.pop();
    if (set?.length === 0) {
      this.list[this.list.indexOf(set)] = undefined;
    }
    this.size--;
    return node;
  }
  empty() {
    return this.size === 0;
  }
}

PF.AStarFinder.prototype.findPath = async function (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  grid: unknown,
) {
  var openList = new PF.Heap(function (nodeA, nodeB) {
      return nodeA.f - nodeB.f;
    }),
    startNode = grid.getNodeAt(startX, startY),
    endNode = grid.getNodeAt(endX, endY),
    heuristic = this.heuristic,
    diagonalMovement = this.diagonalMovement,
    weight = this.weight,
    abs = Math.abs,
    SQRT2 = Math.SQRT2,
    node,
    neighbors,
    neighbor,
    i,
    l,
    x,
    y,
    ng;

  // set the `g` and `f` value of the start node to be 0
  startNode.g = 0;
  startNode.f = 0;

  // push the start node into the open list
  openList.push(startNode);
  startNode.opened = true;

  // while the open list is not empty
  while (!openList.empty()) {
    // yield { openList, grid };
    // pop the position of node which has the minimum `f` value.
    node = openList.pop();
    // grid2.set(node.y, node.x, ".");
    // console.log(node.x, node.y);
    node.closed = true;
    const partial = PF.Util.backtrace(node);
    for (const item of grid2.items()) {
      if (item.symbol === "■") {
        grid2.put(item, ".");
      }
    }
    for (const [x, y] of partial) {
      grid2.set(y, x, "■");
    }
    console.clear();
    grid2.print();
    await sleep(10);
    // if reached the end position, construct the path and return it
    if (node === endNode) {
      return PF.Util.backtrace(endNode);
    }

    // get neigbours of the current node
    neighbors = grid.getNeighbors(node, diagonalMovement);
    for (i = 0, l = neighbors.length; i < l; ++i) {
      neighbor = neighbors[i];

      if (neighbor.closed) {
        continue;
      }

      x = neighbor.x;
      y = neighbor.y;

      // get the distance between current node and the neighbor
      // and calculate the next g score
      ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

      // check if the neighbor has not been inspected yet, or
      // can be reached with smaller cost from the current node
      if (!neighbor.opened || ng < neighbor.g) {
        neighbor.g = ng;
        neighbor.h = neighbor.h ||
          weight * heuristic(abs(x - endX), abs(y - endY));
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = node;

        if (!neighbor.opened) {
          openList.push(neighbor);
          // grid2.set(y, x, "■");
          neighbor.opened = true;
        } else {
          // the neighbor can be reached with smaller cost.
          // Since its f value has been updated, we have to
          // update its position in the open list
          // console.log("update");
          openList.updateItem(neighbor);
        }
      }
    } // end for each neighbor
  } // end while not open list empty

  // fail to find the path
  return [];
};

async function main(slice) {
  const input = readInputSync(import.meta, file).split("\n").slice(0, slice)
    .map((
      line,
    ) => line.split(",").map(Number));

  const g = new PF.Grid(width, width);
  const finder = new PF.AStarFinder();
  input.forEach(([x, y]) => {
    g.setWalkableAt(x, y, false);
    grid2.set(y, x, "#");
  });
  const a = new Array();
  a[10] = 1;

  return finder.findPath(0, 0, width - 1, width - 1, g);
  // for (const it of finder.findPathIt(0, 0, width - 1, width - 1, grid)) {
  //   // console.log(it.openList.toArray()[0].x);
  // }
}
const path = await main(slice);
path.forEach(([x, y]) => grid2.set(y, x, "■"));
console.log(path, path.length);
console.log(
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(JSON.stringify(path)),
      ),
    ),
  ).map((i) => i.toString(16).padStart(2, "0")).join(""),
);
// for (let i = 1; i <= 2862; i++) {
//   main(i);
// }
// 74e4e0e1e7b16ae8b426615920b0ee142950b3fc34ff918be86c7e040080ca78

grid2.print();
