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
         
            if (result.Aluno.MsgFoto) {
                $('#git').removeClass('d-none');
            }
            if (result.Aluno.MsgGeral) {
                $('#discord').removeClass('d-none');
            }
            if (result.Aluno.Status == 'Aprovado') {
                $('#jedi').removeClass('d-none');
            }
        }
    });
}
