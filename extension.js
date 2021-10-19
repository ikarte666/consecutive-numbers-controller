const vscode = require("vscode");

// 익스텐션 활성화 시 activate 함수가 동작
// 등록된 커맨드 실행 시 익스텐션 실행

/**
  @param {vscode.ExtensionContext} context
**/

function numberExtractor(str) {
    let checkedStr = str.split("").reverse();
    let returnArr = [];
    for (let i in checkedStr) {
        if (isNaN(Number(checkedStr[i]))) {
            break;
        }
        returnArr.push(checkedStr[i]);
    }
    returnArr = returnArr.reverse().join("");

    return returnArr;
}

function activate(context) {
    // 커맨드는 package.json 파일에 정의되어야 함
    // registerCommand를 통해 커맨드의 실행을 등록
    // commandId는 package.json의 command 필드와 일치해야함
    const addConsecutiveNumbers = vscode.commands.registerCommand(
        "consecutive-number-controller.addConsecutiveNumbers", // commandId
        function () {
            const currentTextEditor = vscode.window.activeTextEditor; // 활성화된 에디터
            if (!currentTextEditor) {
                return;
            }
            const currentTextDocument = currentTextEditor.document; // 현재 편집중인 문서
            const selections = currentTextEditor.selections;

            const tearedSelections = [];

            let isContainChar = false;

            if (selections.length === 1) {
                const cursorRange = currentTextDocument.lineAt(
                    selections[0].active,
                ).range; // Range 리턴
                const cursorPos = cursorRange.end;
                const cursorLine = cursorRange.end.line;
                const cursorChar = cursorRange.end.character;
                const cursorString = currentTextDocument.getText(cursorRange);

                const lastCharPos = new vscode.Position(
                    cursorLine,
                    cursorChar - 1,
                );
                const lastCharRange = new vscode.Range(lastCharPos, cursorPos);
                const lastChar = currentTextDocument.getText(lastCharRange);

                if (!isNaN(Number(lastChar))) {
                    const replaceNumber = numberExtractor(cursorString); // String return
                    const replacePosIdx = replaceNumber.length;
                    const replacePos = new vscode.Position(
                        cursorLine,
                        cursorChar - replacePosIdx,
                    );
                    const replaceRange = new vscode.Range(
                        replacePos,
                        cursorPos,
                    );
                    currentTextEditor.edit((editBuilder) => {
                        editBuilder.replace(
                            replaceRange,
                            String(Number(replaceNumber) + 1),
                        );
                        return;
                    });
                } else {
                    currentTextEditor.edit((editBuilder) => {
                        editBuilder.insert(cursorPos, String(1));
                        return;
                    });
                }
            } else {
                selections.map((currentSelection) => {
                    const cursorRange = currentTextDocument.lineAt(
                        currentSelection.active,
                    ).range; // Range 리턴
                    const cursorPos = cursorRange.end;
                    const cursorLine = cursorRange.end.line;
                    const cursorChar = cursorRange.end.character;
                    const cursorString =
                        currentTextDocument.getText(cursorRange);

                    const lastCharPos = new vscode.Position(
                        cursorLine,
                        cursorChar - 1,
                    );
                    const lastCharRange = new vscode.Range(
                        lastCharPos,
                        cursorPos,
                    );
                    const lastChar = currentTextDocument.getText(lastCharRange);

                    const selectionObj = {
                        cursorRange,
                        cursorPos,
                        cursorLine,
                        cursorChar,
                        cursorString,
                        lastCharPos,
                        lastCharRange,
                        lastChar,
                    };
                    tearedSelections.push(selectionObj);
                    return;
                }); // tearedSelections에 각각 selection을 분해하여 obj로 만들어 push

                const sortedSelections = tearedSelections.sort((a, b) => {
                    return a.cursorLine - b.cursorLine;
                }); // line number 오름차순으로 정렬

                for (let i in sortedSelections) {
                    sortedSelections[i].idx = i;
                } // 오름차순으로 정렬한대로 idx를 부여

                sortedSelections.every((selection) => {
                    if (isNaN(Number(selection.lastChar))) {
                        isContainChar = true;
                        return false;
                    } else {
                        return true;
                    }
                });

                currentTextEditor.edit((editBuilder) => {
                    for (let idx in sortedSelections) {
                        let num = Number(idx) + 1;
                        if (isContainChar) {
                            editBuilder.insert(
                                sortedSelections[idx].cursorPos,
                                String(num),
                            );
                        } else {
                            const replaceNumber = numberExtractor(
                                sortedSelections[idx].cursorString,
                            );
                            const replacePosIdx = replaceNumber.length;
                            const replacePos = new vscode.Position(
                                sortedSelections[idx].cursorLine,
                                sortedSelections[idx].cursorChar -
                                    replacePosIdx,
                            );
                            const replaceRange = new vscode.Range(
                                replacePos,
                                sortedSelections[idx].cursorPos,
                            );
                            editBuilder.replace(
                                replaceRange,
                                String(Number(replaceNumber) + num),
                            );
                        }
                    }
                    return;
                });
            }
        },
    );
    context.subscriptions.push(addConsecutiveNumbers);
}

// 익스텐션이 비활성화 되면 얘가 동작
function deactivate() {}

module.exports = {
    activate,
    deactivate,
};

/*
커맨드 동작 관련
1. package.json 파일의 activationEvents 항목 : 익스텐션을 활성화 하는 이벤트
2. commands의 command 항목 : 위에 정의된 commandId를 통해 생성한 커맨드와 연결(commandId는 command를 대표)
3. commands의 title 항목 : command를 실행하기 위한 이름
*/
