import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.languages.registerHoverProvider(
		'json',
		{
			provideHover(document, position, token){
				let manifest = JSON.parse(document.getText());
				console.log('manifest => ', manifest)
				let scripts = manifest.scripts;
				console.log('scripts => ', scripts)
				let lineAt = document.lineAt(position).text;
				console.log('lineAt => ', lineAt)
				let scriptAt = lineAt.split(':')[0].trim().replace(/"/g,"");
				console.log('scriptAt => ', scriptAt)
				if(scripts[scriptAt]){
					const favCommandUri = vscode.Uri.parse(`command:vscode-fav.fav`);
					const unFavCommandUri = vscode.Uri.parse(`command:vscode-fav.unfav`);
					const favorited = false;
					let contents = new vscode.MarkdownString(`[⭐](${favCommandUri})`);
					if(favorited){
						contents = new vscode.MarkdownString(`[🚫](${unFavCommandUri})`);
					}
					contents.isTrusted = true;
					return new vscode.Hover(contents);
				}
			}
		}
	)

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
