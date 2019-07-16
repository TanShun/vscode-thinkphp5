import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import * as tp5 from './tp5';

export default class TemplatePathReplacementHover implements vscode.HoverProvider {

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        const root = tp5.appRoot(document);
        if (tp5.isTpProject(root)) {
            const result = tp5.php(root, 'config', 'template.tpl_replace_string');
            if (result.code === 0) {
                const config: { [key: string]: string } = <{ [key: string]: string }>result.content;
                for (let key in config) {
                    if (config.hasOwnProperty(key)) {
                        let reg = new RegExp(`${key}[^ ?"']+`),
                            range: undefined | vscode.Range = document.getWordRangeAtPosition(position, reg);
                        if (range !== undefined) {
                            let file: string = path.join(root.fsPath, 'public', document.getText(range).replace(key, config[key]));
                            try {
                                fs.accessSync(file, fs.constants.F_OK);
                                return new vscode.Hover(new vscode.MarkdownString('File path is `' + file + '`, you can follow this link.'));
                            } catch (error) {
                                console.error(`${file} is not exist.`);
                            }
                        }
                    }
                }
            }
        }
    }
}