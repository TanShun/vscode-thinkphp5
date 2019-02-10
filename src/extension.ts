// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import TemplatePathReplacementDefinition from './templatePathReplacementDefinition';
import TemplatePathReplacementHover from './templatePathReplacementHover';
import ViewTemplateDefinition from './viewTemplateDefinition';
import ViewTemplateHover from './viewTemplateHover';

// import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "vscode-thinkphp5" is now active!');

	// The command has been defined in the package.json file
	let disposable: vscode.Disposable;
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
	// The code you place here will be executed every time your command is executed

	// Display a message box to the user
	// vscode.window.showInformationMessage('Hello World!');
	// });
	// context.subscriptions.push(disposable);

	disposable = vscode.languages.registerHoverProvider({ scheme: 'file', language: 'html', pattern: '**/view/**/*.html' }, new TemplatePathReplacementHover());
	context.subscriptions.push(disposable);

	disposable = vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'html', pattern: '**/view/**/*.html' }, new TemplatePathReplacementDefinition());
	context.subscriptions.push(disposable);

	disposable = vscode.languages.registerHoverProvider({ scheme: 'file', language: 'php', pattern: '**/controller/**/*.php' }, new ViewTemplateHover());
	context.subscriptions.push(disposable);

	disposable = vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'php', pattern: '**/controller/**/*.php' }, new ViewTemplateDefinition());
	context.subscriptions.push(disposable);

}

// this method is called when your extension is deactivated
export function deactivate() { }
