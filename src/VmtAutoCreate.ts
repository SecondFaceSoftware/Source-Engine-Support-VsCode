import * as vscode from "vscode";
import * as main from "./main";
import * as path from "node:path";

export function init(context: vscode.ExtensionContext): void {
    vscode.commands.registerCommand("vmt.autoCreate", _hanndleOnAutoCreate);
}

async function _hanndleOnAutoCreate(resource: vscode.Uri, selectedResources: vscode.Uri[]): Promise<void> {
    // main.debugOutput.appendLine(JSON.stringify(resource));
    // main.debugOutput.appendLine(JSON.stringify(selectedResources));
    
    const allVtfs = _isAllVtfs(selectedResources);
}

function _isAllVtfs(resources: vscode.Uri[]): boolean {
    for (const resource of resources) {
        if(resource.scheme !== "file") return false;
        if(path.extname(resource.fsPath) !== ".vtf") return false;
    }

    return true;
}