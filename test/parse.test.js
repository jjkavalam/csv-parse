const { expect } = require("chai");
const { parseCsv } = require("../index");

describe("parsing", function () {
  it("parses empty input", function () {
    expect(parseCsv("")).to.deep.equal([[""]]);
  });
  it("parses single record", function () {
    expect(parseCsv("a,b,c")).to.deep.equal([["a", "b", "c"]]);
  });
});
