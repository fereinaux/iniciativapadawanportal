function ErrorMessage(message) {
    swal({
        title: "Erro!",
        icon: "error",
        text: message
    });
}

function SuccessMessage(message) {
    swal({
        title: "Sucesso!",
        icon: "success",
        text: message
    });
}

function SuccessMesageDelete() {
    SuccessMessage("Registro excluído!");
}

function SuccessMesageOperation() {
    SuccessMessage("A operação foi concluída!");
}

async function ConfirmMessage(message) {
    return await swal({
        title: "Você tem certeza?",
        icon: "warning",
        text: message,
        buttons: {
            cancel: "Desistir",
            confirm: "Confirmar"
        }
    });
}

async function ConfirmMessageDelete() {
    return await ConfirmMessage("Essa ação excluirá permanentemente o registro, deseja continuar?");
}

async function ConfirmMessageCancelar(nome) {
    return await ConfirmMessage(`Deseja cancelar a inscrição de ${nome}?`);
}

async function ConfirmMessageConfirmar(nome) {
    return await ConfirmMessage(`Deseja confirmar a vaga de ${nome}?`);
}

function RebciboPagamento(valor, formaPagamento, evento) {
    return `Aqui está o seu recibo de pagamento do Realidade:/n/n*R$ ${valor} - ${formaPagamento}*${RodapeEvento(evento)}`;
}

function RodapeEvento(evento) {
    return `Iniciativa Padawan - Grande Mestre Reinaux
_Que a Força esteja com você!_
`;
}

function Convidar(nome) {
    return `Olá *${nome}*,

Você gostaria de trabalhar no próximo Realidade de 17 a 19 de Abril, nossa primeira Aula será na quarta feira (18/03) às 19h30 na *Catedral da Trindade*.

Esse convite é pessoal e *intransferível*. 

Carol Bastos.`;
}