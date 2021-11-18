
$(document).ready(function () {
    GetParticipante();
    $(".password-click").mousedown(function () {
        $("#participante-senha").attr("type", "text");
    });

    $(".password-click").mouseup(function () {
        $("#participante-senha").attr("type", "password");
    });
});

function GetParticipante() {
   
        $.ajax({
            url: "/Participante/GetParticipanteLogado/",
            datatype: "json",
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $("#participante-id").val(data.Participante.Id);
                $(`#participante-nome`).val(data.Participante.Nome);
                $(`#participante-apelido`).val(data.Participante.Apelido);
                $("#participante-data-nascimento").val(moment(data.Participante.DataNascimento).format('DD/MM/YYYY'));
                $(`#participante-email`).val(data.Participante.Email);
                $(`#participante-fone`).val(data.Participante.Fone);
                $(`#participante-nomepai`).val(data.Participante.NomePai);
                $(`#participante-fonepai`).val(data.Participante.FonePai);
                $(`#participante-nomemae`).val(data.Participante.NomeMae);
                $(`#participante-fonemae`).val(data.Participante.FoneMae);
                $(`#participante-nomeconvite`).val(data.Participante.NomeConvite);
                $(`#participante-foneconvite`).val(data.Participante.FoneConvite);
                $(`#participante-restricaoalimentar`).val(data.Participante.RestricaoAlimentar);
                $(`#participante-medicacao`).val(data.Participante.Medicacao);
                $(`#participante-alergia`).val(data.Participante.Alergia);
                $('#participante-senha').val(data.Participante.Senha);
                $('#participante-old-senha').val(data.Participante.Senha);
                $(`input[type=radio][name=participante-sexo][value=${data.Participante.Sexo}]`).iCheck('check');
                $(`input[type=radio][name=participante-hasalergia][value=${data.Participante.HasAlergia}]`).iCheck('check');
                $(`input[type=radio][name=participante-hasmedicacao][value=${data.Participante.HasMedicacao}]`).iCheck('check');
                $(`input[type=radio][name=participante-hasrestricaoalimentar][value=${data.Participante.HasRestricaoAlimentar}]`).iCheck('check');

                $("#participante-numeracao").val(data.Participante.Numeracao);
            }
        });
    }   

function PostParticipante() {
    if (ValidateForm(`#form-participante`)) {
        $.ajax({
            url: "/Inscricoes/PostInscricao/",
            datatype: "json",
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(
                {
                    Id: $("#participante-id").val(),
                    EventoId: $("#participante-eventoid").val(),
                    Nome: $(`#participante-nome`).val(),
                    Apelido: $(`#participante-nome`).val(),
                    Senha: $(`#participante-senha`).val(),
                    OldSenha: $(`#participante-old-senha`).val(),
                    DataNascimento: moment($("#participante-data-nascimento").val(), 'DD/MM/YYYY', 'pt-br').toJSON(),
                    Email: $(`#participante-email`).val(),
                    Fone: $(`#participante-fone`).val(),
                    NomePai: $(`#participante-nomepai`).val(),
                    FonePai: $(`#participante-fonepai`).val(),
                    NomeMae: $(`#participante-nomemae`).val(),
                    FoneMae: $(`#participante-fonemae`).val(),
                    NomeConvite: $(`#participante-nomeconvite`).val(),
                    FoneConvite: $(`#participante-foneconvite`).val(),
                    HasRestricaoAlimentar: $("input[type=radio][name=participante-hasrestricaoalimentar]:checked").val(),
                    RestricaoAlimentar: $(`#participante-restricaoalimentar`).val(),
                    HasMedicacao: $("input[type=radio][name=participante-hasmedicacao]:checked").val(),
                    Medicacao: $(`#participante-medicacao`).val(),
                    HasAlergia: $("input[type=radio][name=participante-hasalergia]:checked").val(),
                    Alergia: $(`#participante-alergia`).val(),
                    Sexo: $("input[type=radio][name=participante-sexo]:checked").val()
                }),
            success: function () {
                SuccessMesageOperation();
                GetParticipante();
            }
        });
    }
}

