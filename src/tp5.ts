import * as vscode from 'vscode';
import * as path from 'path';
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

export function php(appRoot: string, command: string, parameters: string | Array<string> | { [propName: string]: string }): Message {
    const php: string = vscode.workspace.getConfiguration("thinkphp5").get<string>("php", "php");
    if (Array.isArray(parameters)) {
        parameters = parameters.join(' ');
    } else if (typeof parameters === 'object') {
        let parameterArray: Array<string> = [];
        for (const key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                parameterArray.push(key + '=' + parameters[key]);
            }
        }
        parameters = parameterArray.join(' ');
    }
    const entry: string = path.join(__dirname, 'php', 'think');
    try {
        const result: string = execSync(`${php} ${entry} ${appRoot} ${command} ${parameters}`).toString();
        const output: any = JSON.parse(result);
        if (!output) {
            return { code: 101, message: 'Not a json string: "' + result + '"', content: null }
        }
        return output;
    } catch (error) {
        console.error(error);
        return { code: 102, message: error.message, content: null };
    }
}

export function viewPath(template: string, pathinfo: Pathinfo, appRoot: string, config: { [propName: string]: any }): string {
    if (config.view_path === '') {

    }
    if (template === '') {
        return path.join(appRoot, pathinfo.module, 'view', changeCase.snake(pathinfo.controller), changeCase.snake(pathinfo.action) + '.html');
    }
    if (template.charAt(0) === '/') {
        return path.join(appRoot, 'view', template)
    }
    return '';
}