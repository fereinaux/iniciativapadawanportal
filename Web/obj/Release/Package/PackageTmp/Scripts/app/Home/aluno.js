$(document).ready(() => {
    GetResultadosAdmin();
});

function GetResultadosAdmin() {
    $.ajax({
        url: '/Home/GetAlunoInfo',
        datatype: "json",  
        type: "GET",
        success: (data) => {
            result = data.result;

            if (result.Aluno.MsgVacina) {
                $('#setup').removeClass('missing');
            }

            if (result.Aluno.MsgFoto) {
                $('#git').removeClass('missing');
            }
            if (result.Aluno.MsgGeral) {
                $('#discord').removeClass('missing');
            }
            if (result.Aluno.MsgAPI) {
                $('#app').removeClass('missing');
            }
            if (result.Aluno.MsgCommit) {
                $('#commit').removeClass('missing');
            }
            if (result.Aluno.MsgFilme) {
                $('#filme').removeClass('missing');
            }
            if (result.Aluno.MsgSprint) {
                $('#sprint').removeClass('missing');
            }
            if (result.Aluno.Status == 'Aprovado') {
                $('#jedi').removeClass('missing');
                $('#link-certificate').attr('href', `/Arquivo/GetArquivo/${result.Aluno.Foto}`)

            }
        }
    });
}
