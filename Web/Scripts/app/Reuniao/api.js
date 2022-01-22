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

function ExecApi() {
    urlbase = $('#endpoint-movies').val()
    carregarTabelaFilmes()
    $.ajax({
        url: `${urlbase}/people`,
        datatype: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data) {
                $('#characters').text(data.count)
                $('#result-api').removeClass('d-none')
            }
        }
    })
    $.ajax({
        url: `${urlbase}/movies`,
        datatype: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data) {
                $('#films').text(data.count)
            }
        }
    })
    $.ajax({
        url: `${urlbase}/spaceships`,
        datatype: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data) {
                $('#starships').text(data.count)
            }
        }
    })
    $.ajax({
        url: `${urlbase}/planets`,
        datatype: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data) {
                $('#planets').text(data.count)
            }
        }
    })
    $.ajax({
        url: `${urlbase}/vehicles`,
        datatype: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data) {
                $('#vehicles').text(data.count)
            }
        }
    })
    $.ajax({
        url: `${urlbase}/species`,
        datatype: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data) {
                $('#species').text(data.count)
            }
        }
    })
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
                        ExecApi()

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
            type: filme.index != undefined ? "PUT" :"POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(
                {                                    
                    name: $(`#filme-nome`).val(),
                    sequential: $(`#filme-sequencial`).val(),
                    type: $("input[type=radio][name=filme-tipo]:checked").val()
                }),
            success: function () {
                SuccessMesageOperation();
                ExecApi();
                $("#modal-filme").modal("hide");
            }
        });
    }
}
