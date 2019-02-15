import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import * as changeCase from 'change-case';

export interface Pathinfo {
    module: string;
    controller: string;
    action: string;
    [propName: string]: any;
}

export interface Message {
    code: number;
    message: string;
    content: {
        [propName: string]: any
    } | null;
}

/**
 * Execute a php command.
 * @param appRoot The application root for thinkPHP
 * @param command The command name
 * @param parameters The parameters, when an array is given, it will join the items by a blank.
 */
export function php(appRoot: vscode.Uri, command: string, parameters: string | Array<string>): Message {
    const php: string = vscode.workspace.getConfiguration("thinkphp5").get<string>("php", "php");
    if (Array.isArray(parameters)) {
        parameters = parameters.join(' ');
    }
    const entry: string = path.join(__dirname, 'php', 'think');
    try {
        const result: string = execSync(`${php} ${entry} ${appRoot.fsPath} vscode:${command} ${parameters}`).toString();
        const output: any = JSON.parse(result);
        if (!output) {
            return { code: 101, message: result, content: null };
        }
        return output;
    } catch (error) {
        console.error(error);
        return { code: 102, message: error.message, content: null };
    }
}

export function viewPath(template: string, pathinfo: Pathinfo, appRoot: vscode.Uri, config: { [propName: string]: any }): string {
    console.log(config);
    const viewSuffix = config.view_suffix || 'html';
    // TODO: Not support "view_path" and "view_base" arguments
    let viewBase = path.join(pathinfo.module, 'view');

    // case `return $this->fetch();`
    if (template === '') {
        return path.join(appRoot.fsPath, pathinfo.module, 'view', changeCase.snake(pathinfo.controller), changeCase.snake(pathinfo.action) + '.' + viewSuffix);
    }
    // case `return $this->fetch('/menu');`
    if (template.charAt(0) === '/') {
        return path.join(appRoot.fsPath, viewBase, template + '.' + viewSuffix);
    }
    // case `return $this->fetch('../template/public/menu.html');`
    return '';
}

/**
 * Get the application root of thinkPHP project.
 * @param document The current document
 */
export function appRoot(document: vscode.TextDocument): vscode.Uri {
    const workspace = vscode.workspace.getWorkspaceFolder(document.uri);
    return workspace ? workspace.uri : document.uri;
}