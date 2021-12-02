import * as vscode from 'vscode';
import { VSCodeFavProvider } from './treeprovider';

export interface Favorites {
    [key: string]: string
}

export interface CommandHandlerInterface {
    favoritesProvider: VSCodeFavProvider,
    context: vscode.ExtensionContext,
    favoritesKey: string
}