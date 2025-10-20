// Função de validação de formulário
function validarFormulario() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const idade = document.getElementById('idade').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  if (!nome || !email || !idade || !mensagem) {
    alert('Por favor, preencha todos os campos.');
    return false;
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    alert('Por favor, insira um e-mail válido.');
    return false;
  }

  return true;
}

// Função para exibir os dados enviados via GET
function mostrarDados() {
  const params = new URLSearchParams(window.location.search);
  const dadosDiv = document.getElementById('dados');

  let html = '<h2>Dados Recebidos:</h2><ul>';
  params.forEach((valor, chave) => {
    html += `<li><strong>${chave}:</strong> ${valor}</li>`;
  });
  html += '</ul>';

  dadosDiv.innerHTML = html;
}
