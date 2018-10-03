'use strict';

const CANVAS_WIDTH = 4096;
const CANVAS_HEIGHT = 4096;

//const NUM_CELLS_WIDE = 128;
//const NUM_CELLS_HIGH = 128;

const CELL_WIDTH = 4
const CELL_HEIGHT = 4;
const NUM_CELLS_WIDE = CANVAS_WIDTH / CELL_WIDTH;
const NUM_CELLS_HIGH = CANVAS_HEIGHT / CELL_HEIGHT;

const CELL_COLOR_ON = 'green';
const CELL_COLOR_OFF = 'grey';

/* */
const COLORS = ['grey', 'green'];
/* */

/* *
const COLORS = [
  'rgb(0, 0, 0)',
  'rgb(16, 16, 16)',
  'rgb(32, 32, 32)',
  'rgb(48, 48, 48)',
  'rgb(64, 64, 64)',
  'rgb(80, 80, 80)',
  'rgb(96, 96, 96)',
  'rgb(112, 112, 112)',
  'rgb(128, 128, 128)',
  'rgb(144, 144, 144)',
  'rgb(160, 160, 160)',
  'rgb(176, 176, 176)',
  'rgb(192, 192, 192)',
  'rgb(208, 208, 208)',
  'rgb(224, 224, 224)',
  'rgb(240, 240, 240)',
  'rgb(256, 256, 256)',
];
/* */

//const CELL_WIDTH = CANVAS_WIDTH / NUM_CELLS_WIDE;
//const CELL_HEIGHT = CANVAS_HEIGHT / NUM_CELLS_HIGH;

const ACTUAL_SIEVE_MODE = true;

(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const grid = [];
  for (let i = 0; i < NUM_CELLS_WIDE; i++) {
    grid.push([]);
    for (let j = 0; j < NUM_CELLS_HIGH; j++) {
      grid[i].push(0);
    }
  }

  const queue = [];
  const executeNextTask = () => {
    const next = queue.shift();
    paintCell(next[0], next[1], next[2])
  }

  const getColor = (column, row) => {
    //const colorIndex = Math.min(grid[column][row], COLORS.length - 1);

    const colorIndex = grid[column][row] % 2;
    return COLORS[colorIndex];
  };


  // Converts the column, row coordinates to pixel coordinates on the canvas.
  const cellCoordinateToCanvasCoordinate = (column, row) => {
    return {
      x: column * CELL_WIDTH,
      y: row * CELL_HEIGHT,
    };
  }

  // Paints the cell at the specified location with the color for its state.
  const paintCell = (column, row, color=CELL_COLOR_ON) => {
    const {x, y} = cellCoordinateToCanvasCoordinate(column, row);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
  }

  // Wrapper to call paintCell on each cell.
  const paintAllCells = color => {
    for (let i = 0; i < NUM_CELLS_WIDE; i++) {
      for (let j = 0; j < NUM_CELLS_HIGH; j++) {
        paintCell(i, j, color);
      }
    }
  }

  // Paints the specified cell with the color for its opposite state.
  const flipAndPaintCell = (column, row) => {
    //grid[column][row] = !grid[column][row];
    grid[column][row]++;

    //const color = grid[column][row] ? CELL_COLOR_ON : CELL_COLOR_OFF;
    const color = getColor(column, row);

    // To paint rows at a time:
    paintCell(column, row, color);
    // To paint cells at a time:
    //queue.push([column, row, color]);
  }

  /*
   * Interesting:
   *
   * 1.
   *   row = n - 1
   *   col = n - 1
   *
   * 2.
   *   row = n - 1
   *   col = 0
   *
   * 3.
   *   row = 0
   *   col = 0
   *
   * 4. (This one is the idea)
   *   row = 0
   *   col = n - 1
   *
   */

  const namethisfunction = n => {
    let goingUp = true;
    let row = 0;

    for (let col = n - 1; col < grid.length; col++) {
      flipAndPaintCell(col, row);

      if (goingUp && row == n - 1) {
        goingUp = false;
      }

      if (!goingUp && row == 0) {
        goingUp = true;
      }

      if (goingUp) {
        row++;
      } else {
        row--;
      }

    }
  }

  //paintAllCells(CELL_COLOR_OFF);
  paintAllCells('black');

  const MAX_NUM = NUM_CELLS_HIGH;
  //const MAX_NUM = 32;

  for (let i = 2; i < MAX_NUM; i++) {
    namethisfunction(i);
  }

  /* */
  const animate = step => {
    if (step == MAX_NUM) {
      return;
    }

    namethisfunction(step);
    setTimeout(animate, 20, step + 1);
  }

  animate(2);
  /* */


  /* *
  setInterval(executeNextTask, 1);
  /* */

})();
