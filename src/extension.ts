import * as vscode from 'vscode';
import { VSCodeFavProvider } from './treeprovider';
import { favCommandHandler, unFavCommandHandler, hoverProvider, setCommandhandlerParams, executeScriptOrCommand, addCommandHandler } from './handlers';
import { Favorites } from './types';

export function activate(context: vscode.ExtensionContext) {
	const terminals: Map<string, vscode.Terminal> = new Map<string, vscode.Terminal>();
	vscode.window.onDidCloseTerminal(term => {
		terminals.delete(term.name)
	});
	const favoritesKey = 'vscode-fav.favorites';
	context.globalState.setKeysForSync([favoritesKey]);
	const favStorage = <string>context.globalState.get(favoritesKey);
	let favorites: Favorites = favStorage !== undefined ? JSON.parse(JSON.stringify(favStorage)) : {};
	const favoritesProvider = new VSCodeFavProvider(favorites);
	
	const favCommand = `vscode-fav.fav`;
	const unFavCommand = `vscode-fav.unfav`;
	const runCommand = `vscode-fav.run`;
	const addCommand = 'vscode-fav.add';
	context.subscriptions.push(vscode.commands.registerCommand(favCommand, favCommandHandler));
	context.subscriptions.push(vscode.commands.registerCommand(unFavCommand, unFavCommandHandler));
	context.subscriptions.push(vscode.commands.registerCommand(runCommand, executeScriptOrCommand));
	context.subscriptions.push(vscode.commands.registerCommand(addCommand, addCommandHandler))
	setCommandhandlerParams({ favoritesProvider, context, favoritesKey, terminals }, favorites);
	let disposable = hoverProvider();

	vscode.window.registerTreeDataProvider(
		'vscodeFavorites',
		favoritesProvider
	)

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
