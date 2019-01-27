import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export default class Utils {
    static isTpProject(rootPath: vscode.Uri): boolean {
        try {
            fs.accessSync(path.join(rootPath.fsPath, 'think'), fs.constants.F_OK);
            return true;
        } catch (error) {
            return false;
        }
    }

    static rootPath(document: vscode.TextDocument): vscode.Uri {
        const workspace = vscode.workspace.getWorkspaceFolder(document.uri);
        return workspace ? workspace.uri : document.uri;
    }

    static phpCommand(command: string, tpRoot: string, parameters: string = ''): { code: number, message: string, content: { [key: string]: any; } } {
        const bin: string = vscode.workspace.getConfiguration("thinkphp5").get<string>("php", "php");
        const entry: string = path.join(__dirname, 'php', 'think');
        try {
            const result = execSync(`${bin} ${entry} ${command} ${tpRoot} ${parameters}`).toString();
            // console.log(result);
            return JSON.parse(result);
        } catch (error) {
            console.error(error);
        }
        return { code: 0, message: 'Nothing is returned.', content: {} };
    }
}