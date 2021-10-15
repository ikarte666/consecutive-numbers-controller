// vscode 모듈은 익스텐션 제작에 필요한 API를 포함하고 있음
// vscode 모듈을 상수로 기본 정의해둠
const vscode = require("vscode");

// 익스텐션 활성화 시 activate 함수가 동작
// 등록된 커맨드 실행 시 익스텐션 실행

/**
 * 이건 그냥 매개변수 타입 정의 (프로젝트 생성할 때 ts로 안해서 그런듯)
  @param {vscode.ExtensionContext} context
 **/
function activate(context) {
    // console.log로 콘솔창을 통해 오류나 정보 체크 가능, 익스텐션 활성화 시 1회만 동작
    console.log(
        'Congratulations, your extension "consecutive-number-controller" is now active!',
    );

    // 커맨드는 package.json 파일에 정의되어야 함
    // registerCommand를 통해 커맨드의 실행을 등록
    // commandId 매개변수는 package.json의 커맨드 필드와 일치해야함
    const addConsecutiveNumbers = vscode.commands.registerCommand(
        "consecutive-number-controller.addConsecutiveNumbers", // 이게 commandId
        function () {
            const currentTextEditor = vscode.window.activeTextEditor;
            const currentTextDocument = currentTextEditor.document;
            const selections = currentTextEditor.selections;

            if (selections.length === 1) {
                vscode.window.showInformationMessage(
                    `${currentTextDocument.lineAt(selections[0].active).text}`,
                );
            } else {
                selections.map((currentSelection, idx) => {
                    vscode.window.showInformationMessage(
                        `line : ${currentSelection.active.line} char : ${currentSelection.active.character} idx : ${idx}`,
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
