import * as vscode from "vscode";
import { KvPair, KvPiece } from "../Kv";
import * as sourcelib from "sourcelib";
import { KvTokensProviderBase } from "./KvTokensProviderBase";

export default class KvDocument {

    protected _document: vscode.TextDocument;
    protected _tokens: sourcelib.kv.TokenList;

    public get document(): vscode.TextDocument {
        return this._document;
    }

    public get tokens(): sourcelib.kv.TokenList {
        return this._tokens;
    }

    public static from(document: vscode.TextDocument): KvDocument {
        return new KvDocument(document, sourcelib.kv.tokenize(document.getText()));
    }

    public static tokenLegend = new vscode.SemanticTokensLegend([
        "struct",
        "comment",
        "variable",
        "string",
        "number",
        "operator",
        "macro",
        "boolean",
        "keyword",
        "parameter"
    ], [
        "declaration",
        "readonly"
    ]);

    private constructor(document: vscode.TextDocument, tks: sourcelib.kv.TokenList) {
        this._document = document;
        this._tokens = tks;
    }

    public getKeyValueAt(lineNumber: number): KvPair | null {

        const line = this._document.lineAt(lineNumber);
        if (line.isEmptyOrWhitespace)
            return null;
        const tokens = this.tokens.getAllOnLine(lineNumber);

        // Normal old keyvalue
        if (tokens.length == 0)
            return null;

        let keyPiece: KvPiece | null = null;
        const valuePieces: KvPiece[] = [];
        for (const token of tokens) {
            switch (token.type) {
            case sourcelib.kv.TokenType.Key:
                keyPiece = this.getUnquotedToken(token); break;
            case sourcelib.kv.TokenType.Value:
                valuePieces.push(this.getUnquotedToken(token)); break;
            }
        }

        if (keyPiece == null)
            return null;

        return new KvPair(keyPiece, valuePieces);
    }

    public getTokenRange(token: sourcelib.kv.Token): vscode.Range {
        const start = new vscode.Position(token.line, token.range.getStart());
        const end = new vscode.Position(token.line, token.range.getEnd());
        return new vscode.Range(start, end);
    }

    private getUnquotedToken(token: sourcelib.kv.Token): KvPiece {
        const range = this.getTokenRange(token);
        return KvTokensProviderBase.unquoteToken(token, range);
    }

}
