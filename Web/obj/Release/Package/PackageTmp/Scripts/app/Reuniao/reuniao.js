
function CarregarTabelaReuniao() {
    const tableReuniaoConfig = {
        language: languageConfig,
        lengthMenu: [200, 500, 1000],
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
        buttons: getButtonsConfig('Reuniões'),
        columns:columns,
        order: [
            [1, "asc"]
        ],
        ajax: {
            url: '/Reuniao/GetReunioes',
            data: { EventoId: $("#reuniao-eventoid-consulta").val() },
            datatype: "json",
            type: "POST"
        }
    };

    $("#table-reunioes").DataTable(tableReuniaoConfig);
}

function Anexos(id) {
    $("#ReuniaoIdModal").val(id);
    GetAnexos(id);
    $("#modal-anexos").modal();
}

function GetArquivo(id) {
    window.open(`/Arquivo/GetArquivo/${id}`)
}


function DeleteArquivo(id) {
    ConfirmMessageDelete().then((result) => {
        if (result) {
            $.ajax({
                url: "/Arquivo/DeleteArquivo/",
                datatype: "json",
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(
                    {
                        Id: id
                    }),
                success: function () {
                    SuccessMesageDelete();
                    GetAnexos();
                }
            });
        }
    });
}


function PostArquivo() {

    var dataToPost = new FormData($('#frm-upload-arquivo-modal')[0]);
    var arquivo = dataToPost.get('arquivo-modal')
    dataToPost.set('Arquivo', arquivo)
    dataToPost.set('ReuniaoId', dataToPost.get('ReuniaoIdModal'))
    dataToPost.set('EventoId', $("#reuniao-eventoid-consulta").val())
    $.ajax(
        {
            processData: false,
            contentType: false,
            type: "POST",
            data: dataToPost,
            url: "Arquivo/PostArquivo",
            success: function () {

                GetAnexos();


            }
        });
}

$("#arquivo-modal").change(function () {
    PostArquivo();
});


$("#modal-anexos").on('hidden.bs.modal', function () {
    CarregarTabelaReuniao()
});
function GetAnexos(id) {
    const tableArquivoConfig = {
        language: languageConfig,
        lengthMenu: [200, 500, 1000],
        colReorder: false,
        serverSide: false,
        deferloading: 0,
        orderCellsTop: true,
        fixedHeader: true,
        filter: true,
        orderMulti: false,
        responsive: true, stateSave: true,
        destroy: true,
        dom: domConfigNoButtons,
        columns: columnsAnexos,
        order: [
            [0, "asc"]
        ],
        ajax: {
            url: '/Arquivo/GetArquivosReuniao',
            data: { reuniaoId: id ? id : $("#ReuniaoIdModal").val() },
            datatype: "json",
            type: "POST"
        }
    };

    $("#table-anexos").DataTable(tableArquivoConfig);
}

function GetReuniao(id) {
    if (id > 0) {
        $.ajax({
            url: "/Reuniao/GetReuniao/",
            data: { Id: id },
            datatype: "json",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#reuniao-id").val(data.Reuniao.Id);
                $("#reuniao-link").val(data.Reuniao.Link);
                $("#reuniao-data").val(moment(data.Reuniao.DataReuniao).format('DD/MM/YYYY'));
            }
        });
    }
    else {
        $("#reuniao-id").val(0);
        $("#reuniao-data").val("");
        $("#reuniao-link").val("");
    }
}

function EditReuniao(id) {
    GetReuniao(id);
    $("#modal-reunioes").modal();
}

function DeleteReuniao(id) {
    ConfirmMessageDelete().then((result) => {
        if (result) {
            $.ajax({
                url: "/Reuniao/DeleteReuniao/",
                datatype: "json",
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(
                    {
                        Id: id
                    }),
                success: function () {
                    SuccessMesageDelete();
                    CarregarTabelaReuniao();
                }
            });
        }
    });
}

function PostReuniao() {
    if (ValidateForm(`#form-reuniao`)) {
        $.ajax({
            url: "/Reuniao/PostReuniao/",
            datatype: "json",
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(
                {
                    Id: $("#reuniao-id").val(),
                    EventoId: $("#reuniao-eventoid-consulta").val(),
                    Link: $("#reuniao-link").val(),
                    DataReuniao: moment($("#reuniao-data").val(), 'DD/MM/YYYY', 'pt-br').toJSON()
                }),
            success: function () {
                SuccessMesageOperation();
                CarregarTabelaReuniao();
                $("#modal-reunioes").modal("hide");
            }
        });
    }
}

$(document).ready(function () {
    CarregarTabelaReuniao();
});


