const sc = require('./scenario');

describe("scenario", () => {
  let myScenario;

  beforeEach(() => {
    myScenario = [];
  });

  it('has size of 0 when empty', () => {
    expect(sc.scenarioGetSize(myScenario)).toBe(0);
  });

  it('has size of 1 when it has 1 node', () => {
    myScenario.push('node');
    expect(sc.scenarioGetSize(myScenario)).toBe(1);
  });

  it('throws an Error when index is out of bounds', () => {
    expect(() => scenarioGetId(myScenario, 0)).toThrow();
  });

  it('returns the id when passed a valid index', () => {
    myScenario.push({ id: 1 });
    expect(sc.scenarioGetId(myScenario, 0)).toBe(1);
  });

  it('returns null when passed an invalid id', () => {
    myScenario.push({ id: 1, text: "hello" });
    expect(sc.scenarioGetContent(myScenario, 777)).toBe(null);
  });

  it('returns the content when passed a valid id', () => {
    let expectedText = "hello";
    myScenario.push({ id: 1, text: expectedText });
    expect(sc.scenarioGetContent(myScenario, 1).text).toBe(expectedText);
  });

  it('updates the content when passed a valid id', () => {
    let initialContent = { id: 1, text: "hello" };
    let expectedContent = { id: 1, text: "hello hello" };
    myScenario.push(initialContent)
    sc.scenarioUpdateContent(myScenario, 1, expectedContent);
    expect(sc.scenarioGetContent(myScenario, 1)).toBe(expectedContent);
  });

  it("doesn't update the content when passed id is not found", () => {
    let initialContent = { id: 1, text: "hello" };
    let expectedContent = { id: 2, text: "hello hello" };
    myScenario.push(initialContent);
    sc.scenarioUpdateContent(myScenario, 2, expectedContent);
    expect(sc.scenarioGetContent(myScenario, 1)).toBe(initialContent);
  });

  it("deletes a node when passed id is found", () => {
    myScenario.push({ id: 1, text: "hello" });
    myScenario.push({ id: 2, text: "hello hello" });
    myScenario.push({ id: 3, text: "hello hello" });
    let expectedSize = myScenario.length - 1;
    sc.scenarioDeleteNode(myScenario, 2);
    expect(sc.scenarioGetContent(myScenario, 2)).toBe(null);
    expect(sc.scenarioGetSize(myScenario)).toBe(expectedSize);
  });

  it("doesn't delete the node when passed id is not found", () => {
    myScenario.push({ id: 1, text: "hello" });
    myScenario.push({ id: 2, text: "hello hello" });
    myScenario.push({ id: 3, text: "hello hello" });
    sc.scenarioDeleteNode(myScenario, 4);
    expect(sc.scenarioGetSize(myScenario)).toBe(myScenario.length);
  });
});
