import path = require('path');
import * as vscode from 'vscode';

export class FavoriteTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ){
        super(label, collapsibleState);
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'star.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'star.svg')
    }
}