using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Playground
{
    public class PostPlaygroundModel
    {
        public int Id { get; set; }
        public int ParticipanteId { get; set; }
        public string Codigo { get; set; }
        public string Nome { get; set; }
    }
}
