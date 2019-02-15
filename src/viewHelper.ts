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

    static pathinfo(document: vscode.TextDocument): tp5.Pathinfo {
        let module: string = '',
            controller: string = '',
            action: string = '';
        // Find the module
        const path: string = document.uri.path;
        let moduleEnd: number = path.indexOf('controller');
        if (moduleEnd > 0) {
            moduleEnd--;
            let moduleStart: number = path.lastIndexOf('/', moduleEnd - 1) || path.lastIndexOf('\\', moduleEnd - 1);
            if (moduleStart >= 0) {
                module = path.substring(moduleStart + 1, moduleEnd);
            }
        }
        // Find the controller
        const code = document.getText();
        let reg: RegExp = new RegExp('^class (\\\w+)', 'm');
        let matches: RegExpExecArray | null = reg.exec(code);
        if (matches) {
            controller = matches[1];
        }
        // Find the action
        reg = new RegExp('public function (\\\w+)\\\(');
        matches = reg.exec(code);
        if (matches) {
            action = matches[1];
        }

        return {
            module: module,
            controller: controller,
            action: action
        };
    }
}