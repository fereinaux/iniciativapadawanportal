$(document).ready(() => {
    GetResultadosAdmin();
});

var aluno = {}

function GetResultadosAdmin() {
    $.ajax({
        url: '/Home/GetAlunoInfo',
        datatype: "json",
        type: "GET",
        success: (data) => {
            result = data.result;
            aluno = result.Aluno;
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
            }
        }
    });
}

function Certificado() {
    var printDoc = new jsPDF('l', 'cm', 'a4');
    var width = printDoc.internal.pageSize.getWidth();
    var height = printDoc.internal.pageSize.getHeight();
    printDoc.addFont("calibri-normal.ttf", "calibri", "normal");
    printDoc.addFont("calibri-bold.ttf", "calibri", "bold");
    printDoc.setFillColor("1f1d1d");
    printDoc.rect(0, 0, width, height, "F");

    var img = new Image();
    img.src = `/Images/logo-branco.png`;
    printDoc.addImage(img, 'PNG', 7.5, 2, 15, 6);
    printDoc.setFontSize(27);
    printDoc.setFont('calibri', 'bold');


    printDoc.setTextColor("#ffffff")
    printDoc.myText("Certificado de Conclusão", { align: "center" }, 9.5, 9.5);
    printDoc.myText("Concluiu o seu treinamento como Padawan em Node JS", { align: "center" }, 14, 14);
    printDoc.myText("Com carga horária de 40 horas, conquistando o título de", { align: "center" }, 15, 15);

    printDoc.setTextColor("#e2c213")
    printDoc.myText(aluno.Nome, { align: "center" }, 12, 12);
    printDoc.myText("Cavaleiro Jedi", { align: "center" }, 16, 16);
    printDoc.setFillColor("1f1d1d");
    printDoc.rect(17.3, 13, 10, 1.3, "F");
    printDoc.setTextColor("#e2c213")
    printDoc.text(17.39, 14, "Padawan em Node JS", 'left');
    var img = new Image();
    img.src = `/Images/signature.png`;
    printDoc.addImage(img, 'PNG', 11.5, 17, 7, 1.5);
    printDoc.setFillColor("ffffff");
    printDoc.rect(11, 18.7, 7.9, 0.03, "F");
    printDoc.setTextColor("#ffffff")
    printDoc.setFontSize(21);
    var img = new Image();
    img.src = `/Images/linkedin.png`;
    printDoc.addImage(img, 'PNG', 17, 19.25, 0.5, 0.5);
    printDoc.text(12.3, 19.7, "Felipe Reinaux", 'left');
    printDoc.link(12, 18.7, 6, 1.5, { url: 'https://www.linkedin.com/in/reinauxfelipe/' });

    window.open(printDoc.output('bloburl'), '_blank');
}

(function (API) {
    API.myText = function (txt, options, x, y) {
        options = options || {};
        /* Use the options align property to specify desired text alignment
         * Param x will be ignored if desired text alignment is 'center'.
         * Usage of options can easily extend the function to apply different text 
         * styles and sizes 
        */
        if (options.align == "center") {
            // Get current font size
            var fontSize = this.internal.getFontSize();

            // Get page width
            var pageWidth = this.internal.pageSize.width;

            // Get the actual text's width
            /* You multiply the unit width of your string by your font size and divide
             * by the internal scale factor. The division is necessary
             * for the case where you use units other than 'pt' in the constructor
             * of jsPDF.
            */
            txtWidth = this.getStringUnitWidth(txt) * fontSize / this.internal.scaleFactor;

            // Calculate text's x coordinate
            x = (pageWidth - txtWidth) / 2;
        }

        // Draw text at x,y
        this.text(txt, x, y);
    }
})(jsPDF.API);

//function MontarCrachaParticipantes(result) {
//    var printDoc = new jsPDF('l', 'cm', 'a4');

//    heightFoto = 12;
//    widthFoto = 8;
//    result.data = result.data.filter(equipante => equipante.Foto)
//    var indice = 0
//    var xFoto = 0
//    var yFoto = 0








//            console.log(xFoto, yFoto, widthFoto, heightFoto)
//            printDoc.addImage('data:image/jpeg;base64,' + equipante.Foto, 'JPEG', xFoto, yFoto, widthFoto, heightFoto);
//            var img = new Image();
//            img.src = `/Images/circulos/${equipante.Circulo}.png`;
//            printDoc.addImage(img, 'PNG', xFoto, yFoto + 7.8, widthFoto, 3.75);
//            var img = new Image();
//            img.src = `/Images/logo_sombra.png`;
//            printDoc.addImage(img, 'PNG', xFoto + 3.8, yFoto + 10.4, 3.55, 1.25);

//            printDoc.setFontSize(9.8);
//            printDoc.setFont('calibri', 'normal');
//            printDoc.setTextColor(255, 255, 255)
//            printDoc.text(xFoto + 0.4, yFoto + 9.8, equipante.Nome, 'left');
//            printDoc.setFontSize(15.5);
//            printDoc.setFont('calibri', 'bold');
//            printDoc.text(xFoto + 0.4, yFoto + 9.2, equipante.Apelido, 'left');
//            indice++


//    window.open(printDoc.output('bloburl'), '_blank');
//}