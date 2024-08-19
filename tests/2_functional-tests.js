const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

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

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("Validation Tests", () => {
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzleAndSolution[0][0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, puzzleAndSolution[0][1]);
          done();
        });
    });

    test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.. ..5.2.......4..8916..85.72...3",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.. ..5.2.......4..8916..85.72...3.",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..52....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("Placement Tests", () => {
    test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzleAndSolution[1][0], coordinate: "e8", value: "5" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzleAndSolution[1][0], coordinate: "B3", value: "1" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 1);
          assert.equal(res.body.conflict[0], "column");
          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzleAndSolution[1][0], coordinate: "g4", value: "2" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 2);
          assert.equal(res.body.conflict[0], "row");
          assert.equal(res.body.conflict[1], "region");
          done();
        });
    });

    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzleAndSolution[1][0], coordinate: "F8", value: "7" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 3);
          assert.equal(res.body.conflict[0], "row");
          assert.equal(res.body.conflict[1], "column");
          assert.equal(res.body.conflict[2], "region");
          done();
        });
    });

    test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ coordinate: "a2" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..52....9..1....8.2.3674.3.7.2..9.47.u.8..1..16....926914.37.",
          coordinate: "a4",
          value: "3",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..52....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37",
          coordinate: "a5",
          value: "6",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzleAndSolution[1][0], coordinate: "j2", value: "3" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzleAndSolution[1][0],
          coordinate: "a2",
          value: "10",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
