const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

let puzzleAndSolution = [
  [
    "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
    "568913724342687519197254386685479231219538467734162895926345178473891652851726943",
  ],
  [
    "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
    "218396745753284196496157832531672984649831257827549613962415378185763429374928561",
  ],
  [
    ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
    "473891265851726394926345817568913472342687951197254638734162589685479123219538746",
  ],
];

suite("Unit Tests", () => {
  suite("Validation Tests", () => {
    test("Logic handles a valid puzzle string of 81 characters", (done) => {
      assert.equal(
        solver.solve(puzzleAndSolution[0][0]),
        puzzleAndSolution[0][1]
      );
      done();
    });
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
      let invalidPuzzle =
        "..9..5.1.85.4t...2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.solve(invalidPuzzle), false);
      done();
    });
    test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
      let invalidPuzzle1 =
        "..9..5.1.85....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      let invalidPuzzle2 =
        "..9..5.1.85.4.....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solver.solve(invalidPuzzle1), false);
      assert.equal(solver.solve(invalidPuzzle2), false);
      done();
    });
  });
  suite("Placement Tests", () => {
    test("Logic handles a valid row placement", (done) => {
      assert.equal(
        solver.checkRowPlacement(puzzleAndSolution[0][0], 5, 3),
        true
      );
      done();
    });
    test("Logic handles an invalid row placement", (done) => {
      assert.equal(
        solver.checkRowPlacement(puzzleAndSolution[0][0], 6, 2),
        false
      );
      done();
    });
    test("Logic handles a valid column placement", (done) => {
      assert.equal(
        solver.checkColPlacement(puzzleAndSolution[0][0], 3, 6),
        true
      );
      done();
    });
    test("Logic handles an invalid column placement", (done) => {
      assert.equal(
        solver.checkColPlacement(puzzleAndSolution[0][0], 5, 1),
        false
      );
      done();
    });
    test("Logic handles a valid region (3x3 grid) placement", (done) => {
      assert.equal(
        solver.checkRegionPlacement(puzzleAndSolution[0][0], 1, 7, 1),
        true
      );
      done();
    });
    test("Logic handles an invalid region (3x3 grid) placement", (done) => {
      assert.equal(
        solver.checkRegionPlacement(puzzleAndSolution[0][0], 7, 8, 6),
        false
      );
      done();
    });
  });
  suite("Solver Tests", () => {
    test("Valid puzzle strings pass the solver", (done) => {
      assert.equal(
        solver.solve(puzzleAndSolution[1][0]),
        puzzleAndSolution[1][1]
      );
      done();
    });
    test("Invalid puzzle strings fail the solver", (done) => {
      let invalidPuzzle =
        "1.5..2.84..63.12.7.2..52....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.equal(solver.solve(invalidPuzzle), false);
      done();
    });
    test("Solver returns the expected solution for an incomplete puzzle", (done) => {
      assert.equal(
        solver.solve(puzzleAndSolution[2][0]),
        puzzleAndSolution[2][1]
      );
      done();
    });
  });
});
