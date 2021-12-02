import * as vscode from 'vscode';
import { VSCodeFavProvider } from './treeprovider';
import { favCommandHandler, unFavCommandHandler, hoverProvider, setCommandhandlerParams } from './handlers';
import { Favorites } from './types';

export function activate(context: vscode.ExtensionContext) {
	const favoritesKey = 'vscode-fav.favorites';
	context.globalState.setKeysForSync([favoritesKey]);
	const favStorage = <string>context.globalState.get(favoritesKey);
	console.log('favStorage => ', JSON.stringify(favStorage))
	let favorites: Favorites = favStorage !== undefined ? JSON.parse(JSON.stringify(favStorage)) : {};
	const favoritesProvider = new VSCodeFavProvider(favorites);
	setCommandhandlerParams({ favoritesProvider, context, favoritesKey }, favorites);
	
	const favCommand = `vscode-fav.fav`;
	const unFavCommand = `vscode-fav.unfav`;
	context.subscriptions.push(vscode.commands.registerCommand(favCommand, favCommandHandler));
	context.subscriptions.push(vscode.commands.registerCommand(unFavCommand, unFavCommandHandler));
	let disposable = hoverProvider();

	vscode.window.registerTreeDataProvider(
		'vscodeFavorites',
		favoritesProvider
	)

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
