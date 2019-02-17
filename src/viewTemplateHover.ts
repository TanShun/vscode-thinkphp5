import * as vscode from 'vscode';
import ViewHelper from './viewHelper';
import * as tp5 from './tp5';

export default class ViewTemplateHover implements vscode.HoverProvider {

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        const appRoot: vscode.Uri = tp5.appRoot(document);
        let reg: RegExp = new RegExp('.*(view|fetch)\\\(.*');
        if (document.getWordRangeAtPosition(position, reg) !== undefined) {
            const line: vscode.TextLine = document.lineAt(position.line);
            const type = ViewHelper.classify(line.text);
            if (type !== undefined) {
                const viewPath: string | undefined = tp5.viewPath(appRoot, ViewHelper.pathinfo(appRoot, document, line), type.path);
                if (viewPath !== undefined) {
                    return new vscode.Hover(new vscode.MarkdownString(`The template file is \`${viewPath}\`, click to follow it.`));
                }
            }
        }
        return null;
    }
}