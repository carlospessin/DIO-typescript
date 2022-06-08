"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var requestToken;
var username;
var password;
var sessionId;
var apiKey;
var url = 'https://api.themoviedb.org/3';
var loginButton = document.getElementById('login-button');
var searchButton = document.getElementById('search-button');
var searchContainer = document.getElementById('search-container');
loginButton.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, criarRequestToken()];
            case 1:
                _a.sent();
                return [4 /*yield*/, logar()];
            case 2:
                _a.sent();
                return [4 /*yield*/, criarSessao()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
searchButton.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    var lista, query, listaDeFilmes, ul, _i, _a, item, li;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                lista = document.getElementById("lista");
                if (lista) {
                    lista.outerHTML = "";
                }
                query = document.getElementById('search').value;
                return [4 /*yield*/, procurarFilme(query)];
            case 1:
                listaDeFilmes = _b.sent();
                ul = document.createElement('ul');
                ul.id = "lista";
                for (_i = 0, _a = listaDeFilmes.results; _i < _a.length; _i++) {
                    item = _a[_i];
                    li = document.createElement('li');
                    li.appendChild(document.createTextNode(item.original_title));
                    ul.appendChild(li);
                }
                searchContainer.appendChild(ul);
                return [2 /*return*/];
        }
    });
}); });
function preencherSenha() {
    password = document.getElementById('senha').value;
    validateLoginButton();
}
function preencherLogin() {
    username = document.getElementById('login').value;
    validateLoginButton();
}
function preencherApi() {
    apiKey = document.getElementById('api-key').value;
    validateLoginButton();
}
function validateLoginButton() {
    if (password && username && apiKey) {
        loginButton.disabled = false;
    }
    else {
        loginButton.disabled = true;
    }
}
var HttpClient = /** @class */ (function () {
    function HttpClient() {
    }
    HttpClient.get = function (_a) {
        var url = _a.url, method = _a.method, _b = _a.body, body = _b === void 0 ? null : _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var request = new XMLHttpRequest();
                        request.open(method, url, true);
                        request.onload = function () {
                            if (request.status >= 200 && request.status < 300) {
                                resolve(JSON.parse(request.responseText));
                            }
                            else {
                                reject({
                                    status: request.status,
                                    statusText: request.statusText
                                });
                            }
                        };
                        request.onerror = function () {
                            reject({
                                status: request.status,
                                statusText: request.statusText
                            });
                        };
                        if (body) {
                            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                            body = JSON.stringify(body);
                        }
                        request.send(body);
                    })];
            });
        });
    };
    return HttpClient;
}());
function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = encodeURI(query);
                    console.log(query);
                    return [4 /*yield*/, HttpClient.get({
                            url: "".concat(url, "/search/movie?api_key=").concat(apiKey, "&query=").concat(query),
                            method: "GET"
                        })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "".concat(url, "/authentication/token/new?api_key=").concat(apiKey),
                        method: "GET"
                    })];
                case 1:
                    result = _a.sent();
                    requestToken = result.request_token;
                    return [2 /*return*/];
            }
        });
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "".concat(url, "/authentication/token/validate_with_login?api_key=").concat(apiKey),
                        method: "POST",
                        body: {
                            username: "".concat(username),
                            password: "".concat(password),
                            request_token: "".concat(requestToken)
                        }
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient.get({
                        url: "".concat(url, "/authentication/session/new?api_key=").concat(apiKey, "&request_token=").concat(requestToken),
                        method: "GET"
                    })];
                case 1:
                    result = _a.sent();
                    sessionId = result.session_id;
                    if (result.success) {
                        showStatus();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function showStatus() {
    document.getElementById("status").innerHTML = '• conectado';
}
