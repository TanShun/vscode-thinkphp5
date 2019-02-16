import * as vscode from 'vscode';
import ViewHelper from './viewHelper';
import * as tp5 from './tp5';

export default class ViewTemplateDefinition implements vscode.DefinitionProvider {

    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        const appRoot: vscode.Uri = tp5.appRoot(document);
        let reg: RegExp = new RegExp('.*(view|fetch)\\\(.*');
        if (document.getWordRangeAtPosition(position, reg) !== undefined) {
            const line: vscode.TextLine = document.lineAt(position.line);
            const type = ViewHelper.classify(line.text);
            if (type !== undefined) {
                const viewPath: string | undefined = tp5.viewPath(appRoot, ViewHelper.pathinfo(document), type.path);
                if (viewPath !== undefined) {
                    return new vscode.Location(vscode.Uri.file(viewPath), new vscode.Position(0, 0));
                }
            }
        }
        return undefined;
    }
}