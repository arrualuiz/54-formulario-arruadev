// Função para pegar parâmetros da URL

function getParams() {
  const params = new URLSearchParams(window.location.search);
  let obj = {};
  params.forEach((v, k) => obj[k] = v);
  return obj;
}

// Salvar envio no localStorage

function salvarEnvio(dados) {
  let lista = JSON.parse(localStorage.getItem("envios")) || [];
  lista.push({
    ...dados,
    data: new Date().toLocaleString()
  });
  localStorage.setItem("envios", JSON.stringify(lista));
}

// Gerar lista de resultados
function carregarResultados() {
  const container = document.getElementById("listaResultados");
  if (!container) return;

  let lista = JSON.parse(localStorage.getItem("envios")) || [];

  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhum envio registrado.</p>";
    return;
  }

  lista.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>Envio ${index + 1}</h2>
      <p><b>Nome:</b> ${item.nome}</p>
      <p><b>Email:</b> ${item.email}</p>
      <p><b>Telefone:</b> ${item.telefone}</p>
      <p><b>Mensagem:</b> ${item.mensagem}</p>
      <p><small>Enviado em: ${item.data}</small></p>
    `;
    container.appendChild(card);
  });
}

// Quando estiver na page formAction.html
if (window.location.pathname.includes("formAction.html")) {
  const dados = getParams();
  salvarEnvio(dados);
  window.location.href = "resultados.html";
}

// Quando estiver na page resultados.html

if (window.location.pathname.includes("resultados.html")) {
  window.onload = carregarResultados;
}


// Telefone

if (window.location.pathname.includes("telefone.html")) {
  window.onload = carregarResultados;
}
