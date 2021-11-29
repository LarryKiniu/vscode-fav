import * as vscode from 'vscode';
import { VSCodeFavProvider } from './scripts';

export function activate(context: vscode.ExtensionContext) {
	const favoritesKey = 'vscode-fav.favorites';
	context.globalState.setKeysForSync([favoritesKey]);
	context.globalState.update(favoritesKey,undefined);
	const favStorage = <string>context.globalState.get(favoritesKey);
	console.log('favStorage => ', favStorage)
	let favorites = favStorage !== undefined ? JSON.parse(favStorage) : {};
	const favoritesProvider = new VSCodeFavProvider(favorites);
	
	const favCommand = `vscode-fav.fav`;
	const unFavCommand = `vscode-fav.unfav`;
	const favCommandHandler = (scriptName: string, executable: string) => {
		if(!favorites){
			favorites[scriptName] = executable;
			context.globalState.update(favoritesKey,favorites);
			favoritesProvider.refresh();
			vscode.window.showInformationMessage(`✅ ${scriptName} has been added to favorites.`);
		} else {
			if(!(favorites.hasOwnProperty(scriptName))){
				favorites[scriptName] = executable;
				context.globalState.update(favoritesKey,favorites);
				favoritesProvider.refresh();
				vscode.window.showInformationMessage(`✅ ${scriptName} has been added to favorites.`);
			} else {
				vscode.window.showErrorMessage(`🚫 There is a ${scriptName} already added to favorites. Please choose a different name.`);
			}
		}
	}
	const unFavCommandHandler = (scriptName: string) => {
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
	context.subscriptions.push(vscode.commands.registerCommand(favCommand, favCommandHandler));
	context.subscriptions.push(vscode.commands.registerCommand(unFavCommand, unFavCommandHandler));
	let disposable = vscode.languages.registerHoverProvider(
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

	vscode.window.registerTreeDataProvider(
		'vscodeFavorites',
		favoritesProvider
	)

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
