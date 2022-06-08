let requestToken: string;
let username: string;
let password: string;
let sessionId: string;
let apiKey: string;
let url = 'https://api.themoviedb.org/3';

let loginButton = document.getElementById('login-button')! as HTMLInputElement;
let searchButton = document.getElementById('search-button')! as HTMLInputElement;
let searchContainer = document.getElementById('search-container')!;

loginButton.addEventListener('click', async () => {
  await criarRequestToken();
  await logar();
  await criarSessao()
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
  searchContainer.appendChild(ul);
})

function preencherSenha() {
  password = (document.getElementById('senha') as HTMLInputElement).value;
  validateLoginButton();
}

function preencherLogin() {
  username =  (document.getElementById('login') as HTMLInputElement).value;
  validateLoginButton();
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
    url: `${url}/search/movie?api_key=${apiKey}&query=${query}`,
    method: "GET"
  })
  return result
}

async function criarRequestToken () {
  let result = await HttpClient.get({
    url: `${url}/authentication/token/new?api_key=${apiKey}`,
    method: "GET"
  }) as any;
  requestToken = result.request_token;
}

async function logar() {
  await HttpClient.get({
    url: `${url}/authentication/token/validate_with_login?api_key=${apiKey}`,
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
    url: `${url}/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: "GET"
  }) as any
  sessionId = result.session_id;
  if (result.success) {
    showStatus();
  }
}

function showStatus() {
  document.getElementById("status")!.innerHTML = '• conectado';
}
