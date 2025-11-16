function validarFormulario() {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;

    const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/;
    const regexTelefone = /^\(\d{2}\) \d{5}-\d{4}$/;

    if (!regexNome.test(nome)) {
        alert("Nome inválido! Use apenas letras.");
        return false;
    }

    if (!regexTelefone.test(telefone)) {
        alert("Telefone inválido! Use o formato (XX) XXXXX-XXXX");
        return false;
    }

    return true;
}
