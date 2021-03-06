using Core.Models.Reunioes;
using System.Linq;

namespace Core.Business.Reunioes
{
    public interface IReunioesBusiness
    {
        IQueryable<Data.Entities.ReuniaoEvento> GetReunioes(int eventoId);
        Data.Entities.ReuniaoEvento GetReuniaoAtiva();
        Data.Entities.ReuniaoEvento GetReuniaoById(int id);
        void PostReuniao(PostReuniaoModel model);
        void DeleteReuniao(int id);
    }
}
