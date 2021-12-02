import * as vscode from 'vscode';
import { FavoriteTreeItem } from './treeitem';
import { CommandHandlerInterface, Favorites } from './types';
let commandHandlerParams: CommandHandlerInterface;

let favorites: Favorites = {};

export function setCommandhandlerParams(params: CommandHandlerInterface, favoritesParam: Favorites){
    commandHandlerParams = params;
    favorites = favoritesParam;
};
export function favCommandHandler(scriptName: string, executable: string) {
    let { favoritesProvider, context, favoritesKey} = commandHandlerParams;
    if(!(favorites.hasOwnProperty(scriptName))){
        favorites[scriptName] = executable;
        context.globalState.update(favoritesKey,favorites);
        favoritesProvider.refresh();
        vscode.window.showInformationMessage(`✅ ${scriptName} has been added to favorites.`);
    } else {
        vscode.window.showErrorMessage(`🚫 There is a ${scriptName} already added to favorites. Please choose a different name.`);
    }
}

export function unFavCommandHandler(favorite: string | FavoriteTreeItem) {
    let scriptName: string = typeof favorite === 'string' ? favorite : favorite.label;  
    console.log('scriptName => ', scriptName)
    const { favoritesProvider, context, favoritesKey } = commandHandlerParams;
    if(favorites.hasOwnProperty(scriptName)){
        const favObject = favorites;
        delete favObject[scriptName];
        context.workspaceState.update(favoritesKey, favObject);
        favoritesProvider.refresh();
        vscode.window.showInformationMessage(`❌ ${scriptName} has been removed from favorites.`);
    } else {
        vscode.window.showErrorMessage(`🚫 ${scriptName} could not be found in favorites.`);
    } 
}

export function hoverProvider(){
    return vscode.languages.registerHoverProvider(
        'json',
        {
            provideHover(document, position, token){
                let manifest = JSON.parse(document.getText());
                let scripts = manifest.scripts;
                let lineAt = document.lineAt(position).text;
                let scriptAt = lineAt.split(':')[0].trim().replace(/"/g,"");
                if(scripts[scriptAt]){
                    const args = [scriptAt, scriptAt];
                    const favCommandUri = vscode.Uri.parse(`command:vscode-fav.fav?${encodeURIComponent(JSON.stringify(args))}`);
                    const unFavCommandUri = vscode.Uri.parse(`command:vscode-fav.unfav?${encodeURIComponent(JSON.stringify(args))}`);
                    const favorited = favorites && favorites.hasOwnProperty(scriptAt);
                    let contents = new vscode.MarkdownString(`[⭐ Add to favorites](${favCommandUri})`);
                    if(favorited){
                        contents = new vscode.MarkdownString(`[❌ Remove from favorites](${unFavCommandUri})`);
                    }
                    contents.isTrusted = true;
                    return new vscode.Hover(contents);
                }
            }
        }
    )
}