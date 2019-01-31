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

  it("doesn't disconnect the normal node when passed (next) id is not found", () => {
    myScenario.push({ nodeType: 'single', next: 1 });
    myScenario.push({ nodeType: 'single', next: 2 });
    myScenario.push({ nodeType: 'single', next: 3 });
    sc.scenarioDisconnectNormalNode(myScenario, 4);
    for (var i = 0; i < myScenario.length; i++) {
      expect(typeof myScenario[i].next).not.toBe('undefined');
    }
  });

  it("disconnects the normal node when it's next is equal to passed id", () => {
    myScenario.push({ nodeType: 'single', next: 1, gui: { topLineId: 1, topLinePosition: 1 }});
    myScenario.push({ nodeType: 'single', next: 2, gui: { topLineId: 2, topLinePosition: 2 }});
    myScenario.push({ nodeType: 'single', next: 3, gui: { topLineId: 3, topLinePosition: 3 }});
    sc.scenarioDisconnectNormalNode(myScenario, 2);
    expect(typeof myScenario[1].next).toBe('undefined');
    expect(typeof myScenario[1].gui.topLineId).toBe('undefined');
    expect(typeof myScenario[1].gui.topLinePosition).toBe('undefined');
  });

  it("doesn't disconnect the selections node when passed (next) id is not found", () => {
    myScenario.push({ nodeType: 'group', selections: [{ next: 1, gui: { topLineId: 1, topLinePosition: 1 }}]});
    myScenario.push({ nodeType: 'group', selections: [{ next: 2, gui: { topLineId: 2, topLinePosition: 2 }}]});
    myScenario.push({ nodeType: 'group', selections: [{ next: 3, gui: { topLineId: 3, topLinePosition: 3 }}]});
    sc.scenarioDisconnectSelectionsNode(myScenario, 4);
    for (var i = 0; i < myScenario.length; i++) {
      expect(typeof myScenario[i].selections[0].next).not.toBe('undefined');
    }
  });

  it("disconnect the selections node when selections' next is equal to passed id", () => {
    myScenario.push({ nodeType: 'group', selections: [{ next: 1, topLineId: 1, topLinePosition: 1 }]});
    myScenario.push({ nodeType: 'group', selections: [{ next: 2, topLineId: 2, topLinePosition: 2 }]});
    myScenario.push({ nodeType: 'group', selections: [{ next: 3, topLineId: 3, topLinePosition: 3 }]});
    sc.scenarioDisconnectSelectionsNode(myScenario, 2);
    expect(typeof myScenario[1].selections[0].next).toBe('undefined');
    expect(typeof myScenario[1].selections[0].topLineId).toBe('undefined');
    expect(typeof myScenario[1].selections[0].topLinePosition).toBe('undefined');
  });

  it("returns an event when passed id is found", () => {
    myScenario.push({ id: 1, text: "hello" });
    myScenario.push({ id: 2, text: "hello hello" });
    myScenario.push({ id: 3, text: "hello hello hello" });
    expect(sc.scenarioGetEventById(myScenario, 2).text).toBe("hello hello");
  });

  it("returns null when passed id is not found", () => {
    myScenario.push({ id: 1, text: "hello" });
    myScenario.push({ id: 2, text: "hello hello" });
    myScenario.push({ id: 3, text: "hello hello hello" });
    expect(sc.scenarioGetEventById(myScenario, 0)).toBe(null);
  });

});
