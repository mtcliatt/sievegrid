'use strict';

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 1024;
const NUM_CELLS_WIDE = 512;
const NUM_CELLS_HIGH = 512;
const CELL_COLOR_ON = 'green';
const CELL_COLOR_OFF = 'grey';

const CELL_WIDTH = CANVAS_WIDTH / NUM_CELLS_WIDE;
const CELL_HEIGHT = CANVAS_HEIGHT / NUM_CELLS_HIGH;

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
      grid[i].push(false);
    }
  }

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
  const paintAllCells = (color) => {
    for (let i = 0; i < NUM_CELLS_WIDE; i++) {
      for (let j = 0; j < NUM_CELLS_HIGH; j++) {
        paintCell(i, j, color);
      }
    }
  }

  // Paints the specified cell with the color for its opposite state.
  const flipAndPaintCell = (column, row) => {
    grid[column][row] = !grid[column][row];

    const color = grid[column][row] ? CELL_COLOR_ON : CELL_COLOR_OFF;
    paintCell(column, row, color);
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

  paintAllCells(CELL_COLOR_OFF);

  const MAX_NUM = NUM_CELLS_HIGH;

  // TODO - try this with iteration just increasing the timeout.
  const animate = step => {
    if (step == MAX_NUM) {
      return;
    }

    namethisfunction(step);
    setTimeout(animate, 20, step + 1);
  }

  animate(2);

})();
