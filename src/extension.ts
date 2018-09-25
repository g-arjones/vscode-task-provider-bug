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
            const scope = vscode.workspace.workspaceFolders[0];
            const quickTaskName = "Quick Task"
            const slowTaskName = "Slow Task"
            const quickExecution = new vscode.ProcessExecution("/bin/false");
            const slowExecution = new vscode.ProcessExecution("/bin/sleep", ["10000"]);
            const quickKind: TestTaskDefinition = { type: 'test', task: quickTaskName };
            const slowKind: TestTaskDefinition = { type: 'test', task: slowTaskName };

            return [new vscode.Task(quickKind, scope, quickTaskName, 'test', quickExecution, []),
                    new vscode.Task(slowKind, scope, slowTaskName, 'test', slowExecution, [])];
        },
        resolveTask(_task: vscode.Task): vscode.Task | undefined {
            return undefined;
        }
    });

    vscode.tasks.onDidEndTaskProcess((event: vscode.TaskProcessEndEvent) => {
        console.log(`Exit code: ${event.exitCode}`);
    });
}

export function deactivate(): void {
    if (taskProvider) {
        taskProvider.dispose();
    }
}
