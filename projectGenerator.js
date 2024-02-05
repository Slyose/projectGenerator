#!/usr/bin/env node
//shebang

// advanced task for callback heaven sprint
// done intentionally with callbacks

const { rm, mkdir, writeFile } = require("fs");

const { exec } = require("child_process");

function createProject() {
  const projectName = process.argv[2];

  const testFileContents = `describe('Function', () => {
    test('should function properly', () => {
    // Test Assertions here...
    })
})`;
  const nameFormatter = (repoName) =>
    repoName.replace(/([A-Z])/g, "_$1").toLowerCase();

  const packageLockContents = `{
    "name": "${nameFormatter(projectName)}",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \\"Error: no test specified\\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
  }
  `;

  const eslintContents = `{
    "env": {
      "browser": true,
      "es2021": true,
      "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "rules": {
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "single"],
      "semi": ["error", "always"]
    }
  }
  `;

  const gitIgnoreContents = `node_modules
.git`;

  const indexContents = "// Happy hacking!";

  const resetInCaseOfError = (err, projectName) => {
    rm(`./${projectName}`, { recursive: true }, (internalErr) => {
      console.log("Error generating project! Please read:");
      console.log(err);
      if (internalErr) console.log("Error with resetInCaseOfError! Panic!");
      else {
        console.log("Removed partially created repo. Please try again.");
      }
    });
  };

  rm(`./${projectName}`, { recursive: true }, (err) => {
    mkdir(`./${projectName}`, null, (err) => {
      if (err) resetInCaseOfError(err, projectName);
      else {
        console.log(`Created Directory ${projectName}!`);
        writeFile(`./${projectName}/index.js`, indexContents, (err) => {
          if (err) resetInCaseOfError(err, projectName);
          else {
            console.log(`Created Index.js!`);
            mkdir(`./${projectName}/__tests`, null, (err) => {
              if (err) resetInCaseOfError(err, projectName);
              else {
                writeFile(
                  `./${projectName}/__tests/index.test.js`,
                  testFileContents,
                  () => {
                    if (err) resetInCaseOfError(err, projectName);
                    else {
                      console.log("Created test file");
                      writeFile(
                        `./${projectName}/package.json`,
                        packageLockContents,
                        (err) => {
                          if (err) resetInCaseOfError(err, projectName);
                          else {
                            console.log(`Created package.json!`);
                            writeFile(
                              `./${projectName}/README.md`,
                              `# Project Info`,
                              () => {
                                if (err) resetInCaseOfError(err, projectName);
                                else {
                                  console.log("Created README!");
                                  writeFile(
                                    `./${projectName}/.eslintrc.json`,
                                    eslintContents,
                                    () => {
                                      if (err)
                                        resetInCaseOfError(err, projectName);
                                      else {
                                        exec(
                                          "git init",
                                          {
                                            cwd: `${projectName}`,
                                          },
                                          (err, stdout) => {
                                            if (err)
                                              resetInCaseOfError(
                                                err,
                                                projectName
                                              );
                                            else console.log(stdout);
                                          }
                                        );
                                      }
                                    }
                                  );
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            });
          }
        });
      }
    });
  });
}

module.exports = { createProject };
