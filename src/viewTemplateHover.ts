import * as vscode from 'vscode';
import ViewHelper from './viewHelper';
import * as tp5 from './tp5';

export default class ViewTemplateHover implements vscode.HoverProvider {

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        const appRoot = tp5.appRoot(document);
        let reg: RegExp = new RegExp('.*(view|fetch)\\\(.*');
        if (document.getWordRangeAtPosition(position, reg) !== undefined) {
            const line: vscode.TextLine = document.lineAt(position.line);
            console.log(ViewHelper.classify(line.text));
            console.log(ViewHelper.pathinfo(document));
            console.log(tp5.viewPath('', ViewHelper.pathinfo(document), appRoot, tp5.php(appRoot, 'config', 'template.')));
        }
        return new vscode.Hover('This is a view file');
    }
}