'use strict';
import * as vscode from 'vscode';

let taskProvider: vscode.Disposable | undefined;

interface TestTaskDefinition extends vscode.TaskDefinition {
    task: string;
    file?: string;
}

export function activate(_context: vscode.ExtensionContext): void {
    taskProvider = vscode.tasks.registerTaskProvider('test', {
        provideTasks: () => {
            if ((!vscode.workspace.workspaceFolders) || vscode.workspace.workspaceFolders.length < 2) {
                return [];
            }

            const taskName = "Dummy Task"
            const execution = new vscode.ProcessExecution(`/bin/sleep`, ["500"]);
            // const scope = vscode.workspace.workspaceFolders[0];
            const scope = vscode.workspace.workspaceFolders[vscode.workspace.workspaceFolders.length - 1];
            const kind: TestTaskDefinition = {
                type: 'test',
                task: taskName
            };
            return [new vscode.Task(kind, scope, taskName, 'test', execution)];
        },
        resolveTask(_task: vscode.Task): vscode.Task | undefined {
            return undefined;
        }
    });
}

export function deactivate(): void {
    if (taskProvider) {
        taskProvider.dispose();
    }
}
