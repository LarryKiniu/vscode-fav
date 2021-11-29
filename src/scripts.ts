import * as vscode from 'vscode';
import { FavoriteTreeItem } from './FavoriteTreeItem';

export class VSCodeFavProvider implements vscode.TreeDataProvider<FavoriteTreeItem>{
    constructor(private favorites: Object) {
        console.log('favorites => ', favorites)
        this.favorites = favorites;
    }

    private _onDidChangeTreeData: vscode.EventEmitter<FavoriteTreeItem | undefined | null | void> = new vscode.EventEmitter<FavoriteTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<FavoriteTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: FavoriteTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: FavoriteTreeItem): Thenable<FavoriteTreeItem[]> {
        if(element){
            return Promise.resolve([
                new FavoriteTreeItem(
                    element.label,
                    vscode.TreeItemCollapsibleState.Collapsed
                )
            ]
            )
        } else {
            return Promise.resolve(
                Object.keys(this.favorites).map( fav => {
                    return new FavoriteTreeItem(
                        fav,
                        vscode.TreeItemCollapsibleState.None
                    )
                })
            )
        }
    }
}