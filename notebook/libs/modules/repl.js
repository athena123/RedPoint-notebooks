const pty = require("node-pty");
const stripAnsi = require("strip-ansi");

const repl = {
  execute: (codeString, lang) => {
    console.log("BEFORE REPL EXECUTE");

    let replExitMessage;
    let replType;

    switch (lang) {
      case "RUBY":
        replExitMessage = "exit\r";
        replType = "irb";
        break;
      case "JAVASCRIPT":
        replExitMessage = ".exit\r";
        replType = "node";
        break;
    }
    // const lastCellIdx = Object.keys(resultObj).length - 1;

    return new Promise(resolve => {
      const node = pty.spawn(replType);
      let returnData = "";
      node.onData(data => (returnData += stripAnsi(data)));
      node.write(codeString + replExitMessage);
      node.on("exit", () => {
        // assumes REPL is finished, and data is captured, and written to returnData
        console.log("AFTER REPL EXECUTE");
        resolve(returnData);
      });
    });
  },
  parseOutput: (returnData, lang) => {
    // const lastCellIdx = Object.keys(returnData).length - 1;
    switch (lang) {
      case "RUBY":
        return parseRubyOutput(returnData, lastCellIdx);
      case "JAVASCRIPT":
        return parseJSOutput(returnData);
      case "PYTHON":
        return parsePythonOutput(returnData, lastCellIdx);
    }
  }
};

const parseRubyOutput = (resultObj, lastIdx) => {
  return new Promise(resolve => {
    const byOutput = resultObj[lastIdx].replOutput.split("=>");
    const dirtyReturnValue = byOutput[byOutput.length - 1];
    const indexCleanStops = dirtyReturnValue.indexOf("2.4.1"); // fix hard-coding?
    const cleanReturnValue = dirtyReturnValue.slice(0, indexCleanStops);
    resultObj[lastIdx].return = cleanReturnValue;
    resolve(resultObj);
  });
};

const parseJSOutput = returnData => {
  return new Promise(resolve => {
    const byOutput = returnData.split(">");
    const dirtyReturnValue = byOutput[byOutput.length - 2];
    const cleanReturnValue = extractCleanJSReturnValue(dirtyReturnValue);
    debugger;
    resolve(cleanReturnValue);
  });
};

const parsePythonOutput = (resultObj, lastIdx) => {
  return new Promise(resolve => {
    const byOutput = resultObj[lastIdx].result.split(">>>");
    const dirtyReturnValue = byOutput[byOutput.length - 2];
    const indexCleanStarts = dirtyReturnValue.indexOf("\n");
    const cleanReturnValue = dirtyReturnValue.slice(indexCleanStarts);
    resultObj[lastIdx].return = cleanReturnValue;
    resolve(resultObj);
  });
};

const extractCleanJSReturnValue = string => {
  const newlines = [...string.matchAll(/\n/g)];

  // if there was only one line of output from the last line of code executed
  if (newlines.length == 2) {
    return string.slice(newlines[0].index + 1);
    // if multiple lines of output were produced by the final line
  } else {
    return string.slice(newlines[newlines.length - 2].index + 1);
  }
};

module.exports = repl;
