"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate || !value)
      return res.json({ error: "Required field(s) missing" });
    if (solver.validate(puzzle) !== "Valid")
      return res.json({ error: solver.validate(puzzle) });
    const row = coordinate[0].toUpperCase().charCodeAt() - 65;
    const col = +coordinate[1] - 1;
    if (coordinate.length !== 2 || /[^0-8]/.test(row) || /[^0-8]/.test(col))
      return res.json({ error: "Invalid coordinate" });
    if (!/^[1-9]$/.test(value)) return res.json({ error: "Invalid value" });
    if (puzzle[row * 9 + col] === value) {
      return res.json({ valid: true });
    }
    let validRow = solver.checkRowPlacement(puzzle, row, value);
    let validCol = solver.checkColPlacement(puzzle, col, value);
    let validReg = solver.checkRegionPlacement(puzzle, row, col, value);
    let conflict = [];
    if (validCol && validReg && validRow) return res.json({ valid: true });
    else {
      if (!validRow) conflict.push("row");
      if (!validCol) conflict.push("column");
      if (!validReg) conflict.push("region");
    }
    return res.json({ valid: false, conflict });
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;

    if (solver.validate(puzzle) !== "Valid")
      return res.json({ error: solver.validate(puzzle) });

    const solution = solver.solve(puzzle);
    if (!solution) return res.json({ error: "Puzzle cannot be solved" });
    res.json({ solution });
  });
};
