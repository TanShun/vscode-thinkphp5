import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import Utils from './utils';

export default class TemplateFilePathHover implements vscode.HoverProvider {

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        const root = Utils.rootPath(document);
        if (Utils.isTpProject(root)) {
            const config: { [key: string]: any } = Utils.phpCommand('config', root.fsPath).content;
            for (let key in config) {
                if (config.hasOwnProperty(key)) {
                    let reg = new RegExp(`${key}[^ "']+`);
                    if (document.getWordRangeAtPosition(position, reg) !== undefined) {
                        let file: string = document.getText(document.getWordRangeAtPosition(position, reg));
                        file = file.replace(key, config[key]);
                        file = path.join(root.fsPath, 'public', file);
                        try {
                            fs.accessSync(file, fs.constants.F_OK);
                            return new vscode.Hover(file);
                        } catch (error) {
                            console.error(`${file} is not exist.`);
                        }
                    }
                }
            }
        }
    }
}