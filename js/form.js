// Funções de Utilidade (Devem ficar fora do DOMContentLoaded 

function getParams() {
    // Função para pegar parâmetros da URL e DECODIFICAR cada valor
    const params = new URLSearchParams(window.location.search);
    let obj = {};
    params.forEach((v, k) => {
        // Decodificar cada valor para tratar espaços e caracteres especiais corretamente
        obj[k] = decodeURIComponent(v);
    });
    return obj;
}

function salvarEnvio(dados) {
    // Salva no localStorage (funcionalidade extra)
    let lista = JSON.parse(localStorage.getItem("envios")) || [];
    if (Object.keys(dados).length > 0 && dados.nome) {
        lista.push({
            ...dados,
            data: new Date().toLocaleString()
        });
        localStorage.setItem("envios", JSON.stringify(lista));
    }
}

function carregarHistorico(container) {
    const lista = JSON.parse(localStorage.getItem("envios")) || [];

    // Se não houver nada, não mostra nada
    if (lista.length === 0) return;

    let historicoHTML = '<h3>Histórico de Envios:</h3><br>';

    // Mostra TODOS, do mais recente ao mais antigo
    for (let i = lista.length - 1; i >= 0; i--) {
        const item = lista[i];
        historicoHTML += `\n            <div class="card-historico">\n                <p><strong>Envio ${i + 1}</strong> - <small>${item.data}</small></p>\n        `;

        // Mostrar todos os campos do envio (exceto a data, que já exibimos)
        for (const key in item) {
            if (key === 'data') continue;
            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
            // Valores vindos de URLSearchParams já estão decodificados, mas garantir string
            const value = item[key] !== undefined && item[key] !== null ? item[key] : '';
            historicoHTML += `<p><b>${formattedKey}:</b> ${value}</p>`;
        }

        historicoHTML += `\n            </div>\n        `;
    }

    const historicoDiv = document.createElement('div');
    historicoDiv.innerHTML = historicoHTML;
    container.appendChild(historicoDiv);
}


function mascaraTelefone(input) {
    // Máscara de Telefone (Dinamicidade Requisito IV)
    let valor = input.value.replace(/\D/g, '');
    if (valor.length > 0) { valor = valor.replace(/^(\d{2})/, '($1) '); }
    if (valor.length > 9) { valor = valor.replace(/(\d{5})(\d)/, '$1-$2'); } 
    else if (valor.length > 8 && valor.length < 10) { valor = valor.replace(/(\d{4})(\d)/, '$1-$2'); }
    input.value = valor.substring(0, 15);
}

// --------------------------------------------------------------------------------
// Função De Validação (Colocada aqui para ser global, fora do listener)

function validateFieldSutil(input, errorId, validationFn, errorMessage) {
    // Função que exibe erro INLINE (sutil) e aplica a classe CSS
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) errorElement.textContent = '';
    input.classList.remove('input-error');

    if (!validationFn(input.value.trim())) {
        if (errorElement) errorElement.textContent = errorMessage;
        input.classList.add('input-error'); 
        return false; // Falha
    }
    return true; // Sucesso
}

// --------------------------------------------------------------------------------
// --- Lógica Principal (Executada em todas as páginas) ---

document.addEventListener('DOMContentLoaded', function() {

    // TRATAMENTO GET E EXIBIÇÃO (Requisito J e Persistência)
const container = document.getElementById("resultados");

if (container && window.location.pathname.includes("formAction.html")) {

    const dados = getParams();
    let dadosParaExibir = null;
    let isDataFromURL = false;

    // --- Se vier VIA GET e o NOME for válido ---
    if (window.location.search && dados.nome && dados.nome.trim() !== "") {

        // adiciona data ao objeto recebido pela URL
        dados.data = new Date().toLocaleString();

        // salva no localStorage
        salvarEnvio(dados);

        dadosParaExibir = dados;
        isDataFromURL = true;
    }

    // --- Se NÃO veio GET -> pega o último salvo (SEM SALVAR NOVAMENTE) ---
    if (!dadosParaExibir) {
        const lista = JSON.parse(localStorage.getItem("envios")) || [];
        if (lista.length > 0) {
            dadosParaExibir = lista[lista.length - 1];
        }
    }

    // --- Exibir os dados capturados ---
    if (dadosParaExibir) {

        let resultadoHTML = `
            <h2>Dados ${isDataFromURL ? 'Recebidos do Formulário' : 'Anteriores (Salvos)'}:</h2>
            <p><small>Enviado em: ${dadosParaExibir.data}</small></p>
        `;

        for (const key in dadosParaExibir) {
            if (key !== 'data') {
                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                // Dados já estão decodificados em getParams(), não precisa decodificar novamente
                resultadoHTML += `<p><b>${formattedKey}:</b> ${dadosParaExibir[key]}</p>`;
            }
        }

        container.innerHTML = resultadoHTML;

    } else {
        // --- Primeira vez que entra (sem GET e sem histórico) ---
        container.innerHTML = `
            <p>Nenhum envio registrado anteriormente. 
            Envie o formulário em <a href="form.html">form.html</a>.</p>
        `;
    }

    // --- Exibir Histórico se tiver DIV do histórico ---
    const histContainer = document.getElementById("historico");
    if (histContainer) carregarHistorico(histContainer);
    
    // --- Em outra página que lista resultados (resultados.html) ---
    const listaResultados = document.getElementById('listaResultados');
    if (listaResultados) {
        carregarHistorico(listaResultados);
    }
}

    
    // ----------------------------------------------------------------
    // LÓGICA DE SUBMIT E VALIDAÇÃO DO FORMULÁRIO (Requisito I)
    
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function(event) {
            
            event.preventDefault(); 
            let isFormValid = true;
            
            // Validação 1: NOME (Exige pelo menos 2 palavras, min 5 caracteres e SÓ LETRAS)
            const nomeInput = document.getElementById('nome');
            const nomeRegex = /^[a-zA-ZáàâãéèêíïóôõöúüçÁÀÂÃÉÈÊÍÏÓÔÕÖÚÜÇ\s]+$/; // Permite letras, espaços e acentos

            if (!validateFieldSutil(nomeInput, 'error-nome', (value) => {
                // 1. Deve passar no Regex (SÓ LETRAS/ESPAÇOS)
                // 2. Deve ter espaço (duas palavras)
                // 3. Deve ter min 5 caracteres
                return nomeRegex.test(value) && value.includes(' ') && value.length >= 5; 
            }, 'Nome inválido. Use apenas letras e insira nome completo.')) {
                isFormValid = false;
            }

            // Validação 2: EMAIL

            const emailInput = document.getElementById('email');

            // Regex verifica estrutura e não permite caracteres inválidos
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; 

            if (!validateFieldSutil(emailInput, 'error-email', (value) => emailRegex.test(value), 'E-mail inválido. Ex: usuario@dominio.com')) {
                isFormValid = false;
}
            
            // Validação 3: TELEFONE
            const telInput = document.getElementById('telefone');
            if (!validateFieldSutil(telInput, 'error-telefone', (value) => value.replace(/\D/g, '').length >= 10, 'O telefone deve ter DDD + 8 ou 9 dígitos.')) {
                isFormValid = false;
            }

            // Validação 4: MENSAGEM
            const msgInput = document.getElementById('mensagem');
            if (!validateFieldSutil(msgInput, 'error-mensagem', (value) => value.length >= 10, 'A mensagem é obrigatória e deve ter no mínimo 10 caracteres.')) {
                isFormValid = false;
            }

            // --- ENVIO FINAL ---
            if (isFormValid) {
                form.submit(); 
            }
        });
    }
    // FIM DO document.addEventListener
});