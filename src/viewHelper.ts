import * as vscode from 'vscode';
import * as tp5 from './tp5';

export default class ViewHelper {

    static classify(line: string): { name: string, path: string } | undefined {
        let reg: RegExp = new RegExp('->fetch\\\((.*?)\\\)|->fetch\\\((.*)');
        if (reg.test(line)) {
            let matches: RegExpExecArray | null = reg.exec(line);
            if (matches) {
                let path: string = (matches[1] || matches[2] || '').split(',')[0];
                if (matches) {
                    return {
                        name: 'fetch',
                        path: this.trimQuote(path)
                    };
                }
            }
        }

        reg = new RegExp('view\\\((.*?)\\\)|view\\\((.*)');
        if (reg.test(line)) {
            let matches: RegExpExecArray | null = reg.exec(line);
            if (matches) {
                let path: string = (matches[1] || matches[2] || '').split(',')[0];
                if (matches) {
                    return {
                        name: 'view',
                        path: this.trimQuote(path)
                    };
                }
            }
        }

        return undefined;
    }

    static trimQuote(string: string): string {
        const reg = new RegExp('^[\'"]?(.*?)[\'"]?$');
        const matches = reg.exec(string);
        if (matches) {
            return matches[1];
        }
        return '';
    }

    static pathinfo(appRoot: vscode.Uri, document: vscode.TextDocument, line: vscode.TextLine): tp5.Pathinfo {
        let module: string = tp5.getModule(document.uri) || '',
            tpController: tp5.Controller | null = tp5.getController(document),
            controller: string = tpController === null ? '' : tpController.name,
            action: string = '';
        if (tpController !== null) {
            const result = tp5.php(appRoot, 'method-detail', tpController.fullName);
            if (result.code === 0) {
                const methods: Array<{ class: string, name: string, startLine: number, endLine: number }> = <Array<{ class: string, name: string, startLine: number, endLine: number }>>result.content;
                for (let index = 0; index < methods.length; index++) {
                    const method = methods[index];
                    const lineNumber = line.lineNumber + 1;
                    if (lineNumber >= method.startLine && lineNumber <= method.endLine) {
                        action = method.name;
                    }
                }
            }
        }
        return { module, controller, action };
    }
}