import * as vscode from 'vscode';
import ViewHelper from './viewHelper';

export default class ViewTemplateHover implements vscode.HoverProvider {

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        // console.log(ViewHelper.classify("        $this->fetch('abc');"));
        // console.log(position);
        let reg: RegExp = new RegExp('.*(view|fetch)\\\(.*');
        if (document.getWordRangeAtPosition(position, reg) !== undefined) {
            const line: vscode.TextLine = document.lineAt(position.line);
            console.log(ViewHelper.classify(line.text));
            console.log(ViewHelper.pathinfo(document));
            // console.log(line.text);
        }
        return new vscode.Hover('This is a view file');
    }
}