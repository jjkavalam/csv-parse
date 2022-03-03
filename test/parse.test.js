const { expect } = require("chai");
const { parseCsv } = require("../index");

describe("parsing", function () {
  it("parses empty input", function () {
    expect(parseCsv("")).to.deep.equal([[""]]);
  });
  it("parses single record", function () {
    expect(parseCsv("a,b,c")).to.deep.equal([["a", "b", "c"]]);
  });
  it("parses multiple records", function () {
    expect(parseCsv("a,b,c\nd,e")).to.deep.equal([
      ["a", "b", "c"],
      ["d", "e"],
    ]);
  });
  it("parses quoted fields", function () {
    expect(parseCsv('a,"b",c')).to.deep.equal([["a", "b", "c"]]);
  });
  it("parses multiline fields", function () {
    expect(parseCsv('a,"b1\nb2",c')).to.deep.equal([["a", "b1\nb2", "c"]]);
  });
  it("parses escaped quotes", function () {
    expect(parseCsv('a,"b""",c')).to.deep.equal([["a", 'b""', "c"]]);
  });
});
