class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) return "Required field missing";
    if (puzzleString.length !== 81)
      return "Expected puzzle to be 81 characters long";
    if (/[^1-9.]/g.test(puzzleString)) return "Invalid characters in puzzle";
    return "Valid";
  }

  stringToGrid(puzzleString) {
    let grid = [];
    for (let i = 0; i < 9; i++) {
      grid.push(
        puzzleString
          .slice(i * 9, i * 9 + 9)
          .split("")
          .map((v) => (v === "." ? 0 : +v))
      );
    }
    return grid;
  }

  checkRowPlacement(puzzleString, row, value) {
    let grid =
      typeof puzzleString === "string"
        ? this.stringToGrid(puzzleString)
        : puzzleString;
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, col, value) {
    let grid =
      typeof puzzleString === "string"
        ? this.stringToGrid(puzzleString)
        : puzzleString;
    for (let i = 0; i < 9; i++) {
      if (grid[i][col] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    let grid =
      typeof puzzleString === "string"
        ? this.stringToGrid(puzzleString)
        : puzzleString;
    for (let i = 0; i < 9; i++) {
      if (
        grid[3 * Math.floor(row / 3) + Math.floor(i / 3)][
          3 * Math.floor(col / 3) + (i % 3)
        ] == value
      ) {
        return false;
      }
    }
    return true;
  }

  solve(sudoku) {
    if (this.validate(sudoku) !== "Valid") return false;
    // Convert the string into a 2D array (9x9 grid)
    let grid = this.stringToGrid(sudoku);

    // Helper function to check if placing a number is valid
    function isValid(grid, row, col, num) {
      for (let i = 0; i < 9; i++) {
        if (
          (grid[row][i] === num && i !== col) ||
          (grid[i][col] === num && i !== row) ||
          (grid[3 * Math.floor(row / 3) + Math.floor(i / 3)][
            3 * Math.floor(col / 3) + (i % 3)
          ] === num &&
            3 * Math.floor(row / 3) + Math.floor(i / 3) !== row &&
            3 * Math.floor(col / 3) + (i % 3) !== col)
        ) {
          return false;
        }
      }
      return true;
    }

    // Backtracking function to solve the Sudoku
    function solve(grid) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] !== 0 && !isValid(grid, row, col, grid[row][col]))
            return false;
          if (grid[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(grid, row, col, num)) {
                grid[row][col] = num;
                if (solve(grid)) {
                  return true;
                }
                grid[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    }

    // Solve the Sudoku
    if (solve(grid)) {
      // Convert the solved 2D array back to a string
      return grid.flat().join("");
    } else {
      return false;
    }
  }
}

module.exports = SudokuSolver;
