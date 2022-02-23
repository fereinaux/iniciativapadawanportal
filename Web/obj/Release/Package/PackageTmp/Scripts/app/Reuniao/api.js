var urlbase = ''
var filme = {}
function carregarTabelaFilmes() {
    const filmesConfig = {
        language: languageConfig,
        lengthMenu: [50],
        colReorder: false,
        serverSide: false,
        deferloading: 0,
        orderCellsTop: true,
        fixedHeader: true,
        filter: true,
        orderMulti: false,
        responsive: true, stateSave: true,
        destroy: true,
        dom: domConfig,
        buttons: [
            { extend: 'excel', title: 'Filmes' },
            {
                text: 'Adicionar',
                action: function (e, dt, node, config) {
                    EditFilme()
                }
            }
        ],
        columns: [
            { data: "sequential", name: "sequential", autoWidth: true },
            { data: "name", name: "name", autoWidth: true },
            {
                data: "type", name: "type", width: "5%", render: function (data, type, row) {
                    if (data.toLowerCase() === 'classic')
                        cor = "primary";
                    else if (data.toLowerCase() === 'spin-off')
                        cor = "danger";
                    else if (data.toLowerCase() === 'prequel')
                        cor = "info";
                    else if (data.toLowerCase() === 'sequel')
                        cor = "default";
                    else
                        cor = "default"
                    return `<span style="font-size:13px" class="text-center label label-${cor}">${data}</span>`;
                }
            },
            {
                data: "index", name: "index", orderable: false, width: "15%",
                "render": function (data, type, row) {


                    return `${GetButton('DeleteFilme', JSON.stringify(row), 'red', 'fa-trash', 'Excluir')}
                        ${GetButton('EditFilme', JSON.stringify(row), 'blue', 'fa-edit', 'Editar')}      `;
                }
            }
        ],
        order: [
            [1, "asc"]
        ],
        ajax: {
            url: `${urlbase}/movies`,
            datatype: "json",
            type: "GET"
        }
    };

    $("#table-filmes").DataTable(filmesConfig);
}

function verifyErrors(errors, api, data) {
    if (!data.hasOwnProperty('count')) {
        errors.push({
            api, method: 'GET', error: "Missing <strong>count</strong> field"
        })
    }

    if (!data.hasOwnProperty('data')) {
        errors.push({
            api, method: 'GET', error: "Missing <strong>data</strong> field"
        })
    }
}

function handleGenericError(caller, errors, xhr) {
    let error = ''
    switch (xhr.status) {
        case 0:
            error = "Missing <strong>CORS</strong>"
            break;
        default:
            error = "Undefined Error"
    }
    errors.push({
        api: caller.url.substring(caller.url.lastIndexOf('/') + 1), method: caller.type, error
    })
}

function ExecApi() {
    $('#errors-list').html('')
    $('#errors-api').addClass('d-none')
    $('#result-api').addClass('d-none')
    $('#test-api').addClass('d-none')
    $('#allcorrect-api').addClass('d-none')
    let contador = 0
    let errors = []
    urlbase = $('#endpoint-movies').val()
    carregarTabelaFilmes()
    Promise.allSettled([
        $.ajax({
            url: `${urlbase}/people`,
            datatype: "json",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data) {
                    if (data.hasOwnProperty('count') && data.hasOwnProperty('data')) {
                        $('#characters').text(data.count)
                        contador++
                    } else {
                        verifyErrors(errors, 'people', data)
                    }
                }
            },
            error: function (xhr) { handleGenericError(this, errors, xhr) }
        }),
        $.ajax({
            url: `${urlbase}/movies`,
            datatype: "json",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data) {
                    if (data.hasOwnProperty('count') && data.hasOwnProperty('data')) {
                        $('#films').text(data.count)
                        contador++
                    } else {
                        verifyErrors(errors, 'movies', data)
                    }
                }
            },
            error: function (xhr) { handleGenericError(this, errors, xhr) }
        }),
        $.ajax({
            url: `${urlbase}/spaceships`,
            datatype: "json",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data) {
                    if (data.hasOwnProperty('count') && data.hasOwnProperty('data')) {
                        $('#starships').text(data.count)
                        contador++
                    } else {
                        verifyErrors(errors, 'spaceships', data)
                    }
                }
            },
            error: function (xhr) { handleGenericError(this, errors, xhr) }
        }),
        $.ajax({
            url: `${urlbase}/planets`,
            datatype: "json",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data) {
                    if (data.hasOwnProperty('count') && data.hasOwnProperty('data')) {
                        $('#planets').text(data.count)
                        contador++
                    } else {
                        verifyErrors(errors, 'planets', data)
                    }
                }
            },
            error: function (xhr) { handleGenericError(this, errors, xhr) }
        }),
        $.ajax({
            url: `${urlbase}/vehicles`,
            datatype: "json",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data) {
                    if (data.hasOwnProperty('count') && data.hasOwnProperty('data')) {
                        $('#vehicles').text(data.count)
                        contador++
                    } else {
                        verifyErrors(errors, 'vehicles', data)
                    }
                }
            },
            error: function (xhr) { handleGenericError(this, errors, xhr) }
        }),
        $.ajax({
            url: `${urlbase}/species`,
            datatype: "json",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data) {
                    if (data.hasOwnProperty('count') && data.hasOwnProperty('data')) {
                        $('#species').text(data.count)
                        contador++
                    } else {
                        verifyErrors(errors, 'species', data)
                    }
                }
            },
            error: function (xhr) { handleGenericError(this, errors, xhr) }
        })]).then(values => {
            if (values[0].status != "rejected") {
                $.ajax({
                    url: `${urlbase}/movies`,
                    datatype: "json",
                    type: "POST",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(
                        {
                            name: "API TEST 99999999",
                            sequential: 99999999,
                            type: 'API Test POST'
                        }),
                    success: function () {
                        contador++;
                        $.ajax({
                            url: `${urlbase}/movies`,
                            datatype: "json",
                            type: "GET",
                            contentType: 'application/json; charset=utf-8',
                            success: function (data) {
                                if (data) {
                                    if (data.hasOwnProperty('data')) {
                                        let movie = data.data.find(movie => movie.type == "API Test POST")
                                        if (movie) {
                                            let index = movie.index
                                            $.ajax({
                                                url: `${urlbase}/movies/${index}`,
                                                datatype: "json",
                                                type: "PUT",
                                                contentType: 'application/json; charset=utf-8',
                                                data: JSON.stringify(
                                                    {
                                                        name: "API TEST 99999999",
                                                        sequential: 99999999,
                                                        type: 'API Test PUT'
                                                    }),
                                                success: function () {
                                                    contador++;
                                                    $.ajax(
                                                        {
                                                            datatype: "json",
                                                            type: "DELETE",
                                                            contentType: 'application/json; charset=utf-8',
                                                            url: `${urlbase}/movies/${index}`,
                                                            success: function () {
                                                                contador++
                                                                execMontagem(contador, errors)
                                                            }, error: function (xhr, ajaxOptions, thrownError) {
                                                                errors.push({
                                                                    api: 'movies', method: 'DELETE', error: JSON.stringify(xhr)
                                                                })
                                                                execMontagem(contador, errors)

                                                            }
                                                        });
                                                },
                                                error: function (xhr, ajaxOptions, thrownError) {
                                                    errors.push({
                                                        api: 'movies', method: 'PUT', error: JSON.stringify(xhr)
                                                    })

                                                    errors.push({
                                                        api: 'movies', method: 'DELETE', error: "Can not test <strong>DELETE</strong> because <strong>PUT</strong> is incorrect"
                                                    })
                                                    execMontagem(contador, errors)
                                                }
                                            });
                                        }
                                    } else {
                                        errors.push({
                                            api: 'movies', method: 'PUT', error: "Can not test <strong>PUT</strong> because <strong>GET</strong> is incorrect"
                                        })

                                        errors.push({
                                            api: 'movies', method: 'DELETE', error: "Can not test <strong>DELETE</strong> because <strong>GET</strong> is incorrect"
                                        })
                                        execMontagem(contador, errors)
                                    }
                                }
                            }
                        })
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        errors.push({
                            api: 'movies', method: 'POST', error: JSON.stringify({ status: xhr.status, statusText: xhr.statusText, responseText: xhr.responseText, })
                        })

                        errors.push({
                            api: 'movies', method: 'PUT', error: "Can not test <strong>PUT</strong> because <strong>POST</strong> is incorrect"
                        })

                        errors.push({
                            api: 'movies', method: 'DELETE', error: "Can not test <strong>DELETE</strong> because <strong>POST</strong> is incorrect"
                        })
                        execMontagem(contador, errors)
                    }
                })
            } else {
                execMontagem(contador, errors)
            }
        })

}

$(document).ready(() => {
    HideMenu();
});

function execMontagem(contador, errors) {
    $('#result-api').removeClass('d-none')
    $('#test-api').removeClass('d-none')
    montarGrafico(contador)
    if (errors.length > 0) {
        $('#errors-api').removeClass('d-none')
        errors.forEach(error => {
            var cor = 'default'
            switch (error.method) {
                case 'POST':
                    cor = 'primary'
                    break;
                case 'DELETE':
                    cor = 'danger'
                    break;
                case 'PUT':
                    cor = 'success'
                    break;
                default:
                    cor = 'default';
                    break;
            }          
            $('#errors-list').append(
                `<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Error</title>
  </head>
  <body>
    <pre style="line-height: 2;margin:10px;">API: ${error.api}
Método: <span style="font-size:13px" class="text-center label label-${cor}">${error.method}</span>
<span style="font-size:13px" class="text-center text-danger">${isJSON(error.error)}</span></pre>
  </body>
</html>`
            )
        })

    } else {
        $('#allcorrect-api').removeClass('d-none')
    }

}

function isJSON(str) {
    try {
        let obj = JSON.parse(str)
        return `<p>Erro: ${obj.responseText}</p>
        <p>Status: ${obj.status}</p>
        <p>Message: ${obj.statusText}</p>
        `
    } catch (e) {
        return `<p>Erro: ${str}</p>`;
    }
}

function montarGrafico(contador) {
    var ctx = document.getElementById('qtdApi');
    let cores = []
    switch (contador) {
        case 6:
        case 7:
        case 8:
            cores = [
                '#cc9c21',
                '#d2c29a'
            ]
            break;
        case 9:
            cores = [
                '#1ed24a',
                '#99cca5'
            ]
            break;
        default:
            cores = [
                '#de2c2c',
                '#d49393'
            ]
            break;
    }
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        responsive: true,
        maintainAspectRatio: true,
        options: {

            legend: {
                display: false,
            },
            tooltips: {
                enabled: false,
            },
            cutoutPercentage: 70,
            elements: {
                center: {
                    text: `${contador}/9`,
                    color: cores[0], // Default is #000000
                    fontStyle: 'Arial', // Default is Arial
                    sidePadding: 50, // Default is 20 (as a percentage)
                    minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
                    lineHeight: 25 // Default is 25 (in px), used for when text wraps
                }
            }


        },
        data: {

            labels: ['Sucesso', 'Falha'],
            datasets: [{
                label: 'My First Dataset',
                data: [contador, 9 - contador],
                backgroundColor: cores,
                hoverOffset: 4
            }]
        }
    });
}



function DeleteFilme(filme) {
    ConfirmMessage(`Essa ação removerá "${filme.name}", deseja continuar?`).then((result) => {
        if (result) {
            $.ajax(
                {
                    datatype: "json",
                    type: "DELETE",
                    contentType: 'application/json; charset=utf-8',
                    url: `${urlbase}/movies/${filme.index}`,
                    success: function () {
                        handleMovies()

                    }
                });
        }
    }
    )
}

function EditFilme(filmeLocal) {
    filme = filmeLocal || {}
    $(`#filme-nome`).val(filme.name);
    $(`#filme-sequencial`).val(filme.sequential);
    $(`input[type=radio][name=filme-tipo][value=${filme.type}]`).iCheck('check');
    $("#modal-filme").modal();
}



function SaveFilme() {
    if (ValidateForm(`#form-participante`)) {
        $.ajax({
            url: filme.index != undefined ? `${urlbase}/movies/${filme.index}` : `${urlbase}/movies`,
            datatype: "json",
            type: filme.index != undefined ? "PUT" : "POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(
                {
                    name: $(`#filme-nome`).val(),
                    sequential: $(`#filme-sequencial`).val(),
                    type: $("input[type=radio][name=filme-tipo]:checked").val()
                }),
            success: function () {
                handleMovies()
                $("#modal-filme").modal("hide");
            }
        });
    }
}

function handleMovies() {
    SuccessMesageOperation();
    carregarTabelaFilmes();
    $.ajax({
        url: `${urlbase}/movies`,
        datatype: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data) {
                if (data.hasOwnProperty('count')) {
                    $('#films').text(data.count)
                }
            }
        }
    })
}