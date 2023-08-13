// Chama backend para valida o login
const callLogin = () => {

    let account_number = document.getElementById('account_number').value
    let account_pass = document.getElementById('account_pass').value

    const field1 = validateField(account_number, 'account_number')
    const field2 = validateField(account_pass, 'account_pass')

    if (field1 && field2) {
        $.ajax({
            url: '/auth',
            type: 'POST',
            dataType: 'json',
            data: {
                account_number: account_number,
                account_pass: account_pass,
            },
            success: function (response) {
                if (response.statusLogin) {
                    window.location.href = "./"
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Invalid user!',
                    })
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro interno...',
                    html: jqXHR.responseText,
                    allowOutsideClick: false,
                })
            }
        })
    }
}

// Função que realiza o logout
const logout = () => {
    $.ajax({
        url: '/auth',
        type: 'POST',
        dataType: 'json',
        data: {
            logout: true
        },
        success: function (response) {
            window.location.href = "./"
        },
    })
}

// Função que valida os campos do formulário de pagamento
const validateField = (value, id) => {
    if (value == "" || value == null) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'error',
            text: 'Fill in all information!',
        })
        borderadd = document.getElementById(id)
        borderadd.style.border = "1px solid red"
        return false
    }
    return true
}

// Função que chama o backend de depósito
const deposit = (id) => {

    let amount = document.getElementById('amount_deposit').value

    const field1 = validateField(amount, 'amount_deposit')

    if (field1) {
        $.ajax({
            url: '/deposit',
            type: 'POST',
            dataType: 'json',
            data: {
                user_id: id,
                amount: amount
            },
            success: function (response) {
                if (response.statusDeposit) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucess!',
                        html: 'Deposit made!',
                        timer: 3000,
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        didOpen: () => {
                            timerInterval = setInterval(() => {
                                Swal.getTimerLeft()
                            }, 100)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                    }).then((result) => {
                        if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                            window.location.reload()
                        }
                    })
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro interno...',
                    html: jqXHR.responseText,
                    allowOutsideClick: false,
                })
            }
        })
    }
}


// Função que chama o backend de depósito
const withdraw = (id) => {

    let amount = document.getElementById('amount_withdraw').value

    const field1 = validateField(amount, 'amount_withdraw')

    if (field1) {
        $.ajax({
            url: '/withdraw',
            type: 'POST',
            dataType: 'json',
            data: {
                user_id: id,
                amount: amount
            },
            success: function (response) {
                if (response.statusWithdraw) {

                    document.getElementById('modal-withdraw').setAttribute('open', 'false')

                    let returnWithdraw = response.returnWithdraw

                    let qtdCedulas = parseInt(returnWithdraw['cedula1']) +
                        parseInt(returnWithdraw['cedula2']) +
                        parseInt(returnWithdraw['cedula5']) +
                        parseInt(returnWithdraw['cedula10']) +
                        parseInt(returnWithdraw['cedula20']) +
                        parseInt(returnWithdraw['cedula50']) +
                        parseInt(returnWithdraw['cedula100'])

                    let distribution = ''
                    if (returnWithdraw['cedula100'] > 0)    
                        distribution +=  returnWithdraw['cedula100'] + ' banknotes of R$ 100 <br>'
                    if (returnWithdraw['cedula50'] > 0)    
                        distribution +=  returnWithdraw['cedula50'] + ' banknotes of R$ 50 <br>'
                    if (returnWithdraw['cedula20'] > 0)    
                        distribution +=  returnWithdraw['cedula20'] + ' banknotes of R$ 20 <br>'
                    if (returnWithdraw['cedula10'] > 0)    
                        distribution +=  returnWithdraw['cedula10'] + ' banknotes of R$ 10 <br>' 
                    if (returnWithdraw['cedula5'] > 0)    
                        distribution +=  returnWithdraw['cedula5'] + ' banknotes of R$ 5 <br>'
                    if (returnWithdraw['cedula2'] > 0)    
                        distribution +=  returnWithdraw['cedula2'] + ' banknotes of R$ 2 <br>'
                    if (returnWithdraw['cedula1'] > 0)                     
                        distribution +=  returnWithdraw['cedula1'] + ' banknotes of R$ 1 <br>'
                        
                    let html = 'Withdrawal value: R$ ' + amount + ',00<br><br>' +
                        'Number of banknotes: ' + qtdCedulas + '<br><br>' +
                        'Distribution of banknotes:<br><br>' + distribution

                    Swal.fire({
                        title: 'Withdrawal made successfully!',
                        html: html,
                        icon: 'success',
                        confirmButtonText: 'Close',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload()                           
                        }
                    })
                }
                else {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })

                    Toast.fire({
                        icon: 'error',
                        text: 'Insufficient balance for this operation!',
                    })
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro interno...',
                    html: jqXHR.responseText,
                    allowOutsideClick: false,
                })
            }
        })
    }
}

// Chama o backend que retorna os logs de transações 
const loadLog = (id) => {
    $.ajax({
        url: '/getLog',
        type: 'POST',
        dataType: 'json',
        data: {
            user_id: id,            
        },
        success: function (response) {
            document.getElementById('tbody-log').innerHTML = response.returnLog;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Swal.fire({
                icon: 'error',
                title: 'Erro interno...',
                html: jqXHR.responseText,
                allowOutsideClick: false,
            })
        }
    })
}

// Impede mensagem de alerta de formulário ao recarregar a página
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}