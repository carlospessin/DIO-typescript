let requestToken: string;
let username: string;
let password: string;
let sessionId: any;
let listId: number;
let apiKey: string;
let listName: string;
let listDescription: string;
let accountId: number;

// d9556a6ad7841dd5a2a1f88086601086

let loginButton = document.getElementById('login-button')! as HTMLInputElement;
let listaButton = document.getElementById('lista-button')! as HTMLInputElement;
let searchButton = document.getElementById('search-button')! as HTMLInputElement;
let searchContainer = document.getElementById('search-container')!;
let containerMyList = document.getElementById('container-my-list')!;

document.getElementById('criar-lista')!.style.display = 'none';

loginButton.addEventListener('click', async () => {
  await criarRequestToken();
  await logar();
  await criarSessao()
})

listaButton.addEventListener('click', async () => {
  await criarLista(listName, listDescription).then((res) => {
    if (res.success) {
      alert('lista criada!');
      listId = res.list_id;
    }
  });
})

searchButton.addEventListener('click', async () => {
  let lista = document.getElementById("lista");
  if (lista) {
    lista.outerHTML = "";
  }
  let query = (document.getElementById('search') as HTMLInputElement).value;
  let listaDeFilmes = await procurarFilme(query) as any;
  let ul = document.createElement('ul');
  ul.id = "lista"
  for (const item of listaDeFilmes.results) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(item.original_title))
    ul.appendChild(li)
  }
  console.log(listaDeFilmes);
  searchContainer.appendChild(ul);
})

function preencherSenha() {
  password = (document.getElementById('senha') as HTMLInputElement).value;
  validateLoginButton();
}

function preencherLogin() {
  username = (document.getElementById('login') as HTMLInputElement).value;
  validateLoginButton();
}

function preencherNomeDaLista() {
  listName = (document.getElementById('nome-da-lista') as HTMLInputElement).value;
  validateListaButton();
}

function preencherDescricaoDaLista() {
  listDescription = (document.getElementById('descricao-da-lista') as HTMLInputElement).value;
  validateListaButton();
}

function preencherApi() {
  apiKey = (document.getElementById('api-key') as HTMLInputElement).value;
  validateLoginButton();
}

function validateLoginButton() {
  if (password && username && apiKey) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

function validateListaButton() {
  if (listName && listDescription) {
    listaButton.disabled = false;
  } else {
    listaButton.disabled = true;
  }
}

class HttpClient {
  static async get({url, method, body = null}: {url: string, method: any, body?: any}) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      }
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText
        })
      }

      if (body) {
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        body = JSON.stringify(body);
      }
      request.send(body);
    })
  }
}

async function procurarFilme(query: any) {
  query = encodeURI(query)
  console.log(query)
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: "GET"
  })
  return result
}

async function adicionarFilme(filmeId: string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
    method: "GET"
  })
  return result;
}

async function getAccount() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${sessionId}`,
    method: "GET"
  }) as any;
  accountId = result.id;
}

async function criarRequestToken () {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: "GET"
  }) as any;
  requestToken = result.request_token;
}

async function logar() {
  await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`
    }
  })
}

async function criarSessao() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: "GET"
  }) as any
  sessionId = result.session_id;
  if (result.success) {
    showOptions();
  }
}

async function showOptions() {
  document.getElementById("status")!.innerHTML = '• conectado';
  document.getElementById('criar-lista')!.style.display = 'flex';

  let mylist = await pegarLista(listId) as any;
  let ul = document.createElement('ul');
  ul.id = "lista"
  for (const item of mylist.results) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(item.original_title))
    ul.appendChild(li)
  }
  searchContainer.appendChild(ul);
}

async function criarLista(nomeDaLista: any, descricao: any) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      name: nomeDaLista,
      description: descricao,
      language: "pt-br"
    }
  }) as any;
  return result;
}

async function adicionarFilmeNaLista(filmeId: any, listaId: any) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      media_id: filmeId
    }
  })
  console.log(result);
}

async function pegarLista(listId: number) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET"
  });
  return result;
}