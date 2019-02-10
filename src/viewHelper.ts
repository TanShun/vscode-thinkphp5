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

    static pathinfo(code: string): { class: string, method: string } {
        let reg: RegExp = new RegExp('^class (\\\w+)', 'm');
        let matches: RegExpExecArray | null = reg.exec(code);
        let className: string = '',
            methodName: string = '';
        if (matches) {
            className = matches[1];
        }
        reg = new RegExp('public function (\\\w+)\\\(');
        matches = reg.exec(code);
        if (matches) {
            methodName = matches[1];
        }
        return {
            class: className,
            method: methodName
        };
    }
}