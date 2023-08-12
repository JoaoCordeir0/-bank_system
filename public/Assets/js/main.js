var cardFlagFunction = {

    /**
     * getCardFlag
     * Return card flag by number
     *
     * @param cardnumber
     */
    getCardFlag: function(cardnumber) {
        var cardnumber = cardnumber.replace(/[^0-9]+/g, '');

        var cards = {
            visa: /^4[0-9]{12}(?:[0-9]{3})/,
            mastercard: /^5[1-5][0-9]{14}/,
            diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
            amex: /^3[47][0-9]{13}/,
            discover: /^6(?:011|5[0-9]{2})[0-9]{12}/,
            hipercard: /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
            elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/,
            jcb: /^(?:2131|1800|35\d{3})\d{11}/,
            aura: /^(5078\d{2})(\d{2})(\d{11})$/
        };

        for (var flag in cards) {
            if (cards[flag].test(cardnumber)) {
                return flag;
            }
        }
        return false;
    }
}

// Responsável por validar os campos do formulário de pagamento
const validateField = (value, id) => {
    if (value == "" || value == null) {
        if (id == 'cardExpiryDateMonth' || id == 'cardExpiryDateYear')
            id = 'expiry-select'
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Preencha todas as informações',
        })
        borderadd = document.getElementById(id)
        borderadd.style.border = "1px solid red"
        return false
    } else if (id == "cardCvv" && !(value.length == 3)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'CVV inválido!',
        })
        borderadd = document.getElementById(id)
        borderadd.style.border = "1px solid red"
        return false
    }
    return true
}

// Responsável por validar o campo de e-mail
const validateEmail = (value, id) => {
    fieldEmail = document.getElementById(id)
    if (fieldEmail.getAttribute('data-required') == '1') {
        if (value == "" || value == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Preencha todas as informações',
            })
            fieldEmail.style.border = "1px solid red"
            return false
        }
    }
    if (value.length >= 1) {
        if (!IsEmail(value)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Informe um e-mail válido',
            })
            fieldEmail.style.border = "1px solid red"
            return false
        }
    }
    return true
}

// Função que valida se o e-mail informado é valido
const IsEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

const formatCardNumber = () => {
    var value = cardNumber.value.replace(/\D/g, '');
    var formattedValue;

    flag = cardFlagFunction.getCardFlag(cardNumber.value)

    if (flag != false) {
        document.getElementById("iconFlagCard").setAttribute("src", "./public/Assets/img/logo-" + flag + ".png")
    } else {
        document.getElementById("iconFlagCard").setAttribute("src", "")
    }

    // american express, 15 digits
    if ((/^3[47]\d{0,13}$/).test(value)) {
        formattedValue = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ');
        maxLength = 17;
    }
    // diner's club, 14 digits
    else if ((/^3(?:0[0-5]|[68]\d)\d{0,11}$/).test(value)) {
        formattedValue = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ');
        maxLength = 16;
    }
    // regular cc number, 16 digits
    else if ((/^\d{0,16}$/).test(value)) {
        formattedValue = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
        maxLength = 19;
    }

    cardNumber.setAttribute('maxlength', maxLength)

    cardNumber.value = formattedValue;
}

try {
    // Formata campo do número do cartão
    const cardNumber = document.getElementById("cardNumber")

    cardNumber.addEventListener('keypress', formatCardNumber)
    cardNumber.addEventListener('focusout', formatCardNumber)
} catch (e) {
    // Nenhum tratamento é necessário pois apenas significa que o campo de número do cartão não foi encontrado.
}

try {
    // Altera as parcalas para somente á vista quando selecionar cartão de débito
    const methodDebit = document.getElementById("methodDebit")
    methodDebit.addEventListener("click", () => {
        // Desabilita as outras opções        
        let p2x = document.getElementById("2x")
        let p3x = document.getElementById("3x")
        let p4x = document.getElementById("4x")
        let p5x = document.getElementById("5x")
        let p6x = document.getElementById("6x")

        if (p2x)
            p2x.style.display = "none"
        if (p3x)
            p3x.style.display = "none"
        if (p4x)
            p4x.style.display = "none"
        if (p5x)
            p5x.style.display = "none"
        if (p6x)
            p6x.style.display = "none"

        document.getElementById("cardParcels").value = 1
    })
} catch (e) {
    // Nenhum tratamento necessário, a exceção apenas signigica que o módulo débito não foi carregado.
}
try {
    // Exibe as opções de parcelas caso o cartão seja de crédito
    const methodCredit = document.getElementById("methodCredit")
    methodCredit.addEventListener("click", () => {
        // Desabilita as outras opções        
        let p2x = document.getElementById("2x")
        let p3x = document.getElementById("3x")
        let p4x = document.getElementById("4x")
        let p5x = document.getElementById("5x")
        let p6x = document.getElementById("6x")

        if (p2x)
            p2x.style.display = "block"
        if (p3x)
            p3x.style.display = "block"
        if (p4x)
            p4x.style.display = "block"
        if (p5x)
            p5x.style.display = "block"
        if (p6x)
            p6x.style.display = "block"

        document.getElementById("cardParcels").value = 1
    })
} catch (e) {
    // Nenhum tratamento necessário, a exceção apenas signigica que o módulo crédito não foi carregado.
}

// Controle da borda do select de validade
const controlSelectExpiryDate = (status) => {
    let boxExpiryDate = document.getElementById("expiry-select")
    boxExpiryDate.style.color = 'gray'
    boxExpiryDate.style.border = '1px solid lightgray'
    if (status == 'on')
        boxExpiryDate.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, .25)'
    else
        boxExpiryDate.style.boxShadow = ''
}

// Preenche messes da validade do cartão
function fillMonths() {
    let months = document.getElementById("expiryDateMonth")
    for (let c = 1; c <= 12; c++) {
        if (c < 10) {
            c = '0' + c
        }
        let option = document.createElement('option')
        option.value = c
        option.text = c
        months.appendChild(option)
    }
}

// Preenche anos da validade do cartão
function fillYears() {
    const actualYear = new Date().getFullYear();

    let years = document.getElementById("ExpiryDateYear")

    for (let c = actualYear; c <= actualYear + 12; c++) {
        let option = document.createElement('option')
        option.value = c
        option.text = c
        years.appendChild(option)
    }
}

// Preenche as parcelas 
function fillParcels(limit_parcels) {
    let qtd = parseInt(limit_parcels)
    if (qtd != "" && qtd > 1) {
        let parcels = document.getElementById("cardParcels")

        for (let c = 2; c <= qtd; c++) {
            let option = document.createElement('option')
            option.value = c
            option.id = c + 'x'
            option.text = c + 'x sem juros'
            parcels.appendChild(option)
        }
    }
}

// Impede mensagem de alerta de formulário ao recarregar a página
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}