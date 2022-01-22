using System;

namespace SysIgreja.ViewModels
{
    public class ReuniaoViewModel
    {
        public int Id { get; set; }
        public DateTime DataReuniao { get; set; }
        public int Presenca { get; set; }
        public int QtdAnexos { get; set; }
        public string Link { get; internal set; }
        public string DataTexto { get; internal set; }
        public string Descricao { get; internal set; }
    }

    
}
