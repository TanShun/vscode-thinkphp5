import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import * as tp5 from './tp5';

export default class TemplatePathReplacementDefinition implements vscode.DefinitionProvider {

    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        const root = tp5.appRoot(document);
        if (tp5.isTpProject(root)) {
            const config: { [key: string]: any } = <{ [key: string]: any }>tp5.php(root, 'config', 'template.tpl_replace_string').content;
            for (let key in config) {
                if (config.hasOwnProperty(key)) {
                    let reg = new RegExp(`${key}[^ "']+`);
                    if (document.getWordRangeAtPosition(position, reg) !== undefined) {
                        let file: string = document.getText(document.getWordRangeAtPosition(position, reg));
                        file = file.replace(key, config[key]);
                        file = path.join(root.fsPath, 'public', file);
                        try {
                            fs.accessSync(file, fs.constants.F_OK);
                            return new vscode.Location(vscode.Uri.file(file), new vscode.Position(0, 0));
                        } catch (error) {
                            console.error(`${file} is not exist.`);
                        }
                    }
                }
            }
        }
    }
}