// vscode 모듈은 익스텐션 제작에 필요한 API를 포함하고 있음
// vscode 모듈을 상수로 기본 정의해둠
const vscode = require("vscode");

// 익스텐션 활성화 시 activate 함수가 동작
// 등록된 커맨드 실행 시 익스텐션 실행

/**
  @param {vscode.ExtensionContext} context
**/
function activate(context) {
    const logChannel = vscode.window.createOutputChannel("debug");

    function log(msg) {
        logChannel.appendLine(msg);
        logChannel.show();
    } // 로그용 함수

    // 커맨드는 package.json 파일에 정의되어야 함
    // registerCommand를 통해 커맨드의 실행을 등록
    // commandId 매개변수는 package.json의 커맨드 필드와 일치해야함
    const addConsecutiveNumbers = vscode.commands.registerCommand(
        "consecutive-number-controller.addConsecutiveNumbers", // 이게 commandId
        function () {
            const currentTextEditor = vscode.window.activeTextEditor; // 활성화된 에디터
            if (!currentTextEditor) {
                return;
            }
            const currentTextDocument = currentTextEditor.document; // 현재 편집중인 문서
            const selections = currentTextEditor.selections;

            const charArr = [];

            if (selections.length === 1) {
                const cursorRange = currentTextDocument.lineAt(
                    selections[0].active,
                ).range; // Range 리턴
                const cursorPos = cursorRange.end;
                const cursorLine = cursorRange.end.line;
                const cursorChar = cursorRange.end.character;
                const lastCharPos = new vscode.Position(
                    cursorLine,
                    cursorChar - 1,
                );
                const lastCharRange = new vscode.Range(lastCharPos, cursorPos);
                const lastChar = currentTextDocument.getText(lastCharRange);

                currentTextEditor.edit((editBuilder) => {
                    editBuilder.insert(cursorPos, "hihi");
                    return;
                });
            } else {
                selections.map((currentSelection, idx) => {
                    vscode.window.showInformationMessage(
                        `${
                            currentTextDocument.lineAt(currentSelection.active)
                                .text[-1]
                        }`,
                    );
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
