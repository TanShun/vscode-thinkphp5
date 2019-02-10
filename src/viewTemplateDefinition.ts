import * as vscode from 'vscode';
import ViewHelper from './viewHelper';

export default class ViewTemplateDefinition implements vscode.DefinitionProvider {

    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        // console.log(position);
        let reg: RegExp = new RegExp('.*(view|fetch)\\\(.*');
        if (document.getWordRangeAtPosition(position, reg) !== undefined) {
            const line: vscode.TextLine = document.lineAt(position.line);
            console.log(ViewHelper.classify(line.text));
            // console.log(line.text);
        }
        // console.log(range);
        return undefined;
        // return new vscode.Location(vscode.Uri.file('file'), new vscode.Position(0, 0));
    }
}