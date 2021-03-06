import * as vscode from 'vscode';
import * as path from 'path';
import { execSync } from 'child_process';

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
    } | null | string;
}

export interface Controller {
    namespace: string;
    name: string;
    fullName: string;
    [propName: string]: any;
}

/**
 * Execute a php command.
 * @param appRoot The application root for thinkPHP
 * @param command The command name
 * @param parameters The parameters, when an array is given, it will join the items by a blank.
 */
export function php(appRoot: vscode.Uri, command: string, parameters: string | Array<string> = ''): Message {
    const php: string = vscode.workspace.getConfiguration("thinkphp5").get<string>("php", "php");
    if (Array.isArray(parameters)) {
        parameters = parameters.join(' ');
    }
    const entry: string = path.join(__dirname, 'php', 'think');
    try {
        // console.log(`PHP command: "${php} ${entry} ${appRoot.fsPath} vscode:${command} ${parameters}"`);
        const result: string = execSync(`${php} ${entry} ${appRoot.fsPath} vscode:${command} ${parameters}`).toString();
        // console.log(result);
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

/**
 * Get the template file's real path.
 * @param appRoot The root path of the thinkPHP project
 * @param pathinfo It contains module, controller and action
 * @param template The name of the template
 */
export function viewPath(appRoot: vscode.Uri, pathinfo: Pathinfo, template: string): string | undefined {
    const result = php(appRoot, 'view-path', [[pathinfo.module, pathinfo.controller, pathinfo.action].join('/'), template]);

    if (result.code === 0) {
        return <string>result.content;
    }
    return undefined;
}

/**
 * Get the application root of thinkPHP project.
 * @param document The current document
 */
export function appRoot(document: vscode.TextDocument): vscode.Uri {
    const workspace = vscode.workspace.getWorkspaceFolder(document.uri);
    return workspace ? workspace.uri : document.uri;
}

/**
 * Get thinkPHP framework's version.
 * @param appRoot The application root of thinkPHP project
 */
export function tpVersion(appRoot: vscode.Uri): string | undefined {
    const result = php(appRoot, 'version');
    if (result.code === 0) {
        return <string>result.content;
    }
    return undefined;
}

/**
 * Check whether thinkPHP framework has been used.
 * @param appRoot The application root of thinkPHP project
 */
export function isTpProject(appRoot: vscode.Uri): boolean {
    return !!tpVersion(appRoot);
}

export function getModule(uri: vscode.Uri): string | undefined {
    const path = uri.path;
    let moduleName: string | undefined = undefined;
    let moduleEnd: number = path.indexOf('controller');
    if (moduleEnd > 0) {
        moduleEnd--;
        let moduleStart: number = path.lastIndexOf('/', moduleEnd - 1) || path.lastIndexOf('\\', moduleEnd - 1);
        if (moduleStart >= 0) {
            moduleName = path.substring(moduleStart + 1, moduleEnd);
        }
    }
    return moduleName;
}

export function getController(document: vscode.TextDocument): Controller | null {
    const code = document.getText();
    let reg: RegExp = new RegExp('^class (\\\w+)', 'm'),
        matches: RegExpExecArray | null = reg.exec(code),
        namespace: string = '',
        name: string = '',
        fullName: string = '';

    if (!matches) {
        return null;
    }
    fullName = name = matches[1];

    reg = new RegExp('^namespace (.*?);', 'm');
    matches = reg.exec(code);
    if (matches) {
        namespace = matches[1];
        fullName = namespace + '\\' + name;
    }
    return { namespace, name, fullName };
}