using Core.Business.Equipes;
using Core.Models.Eventos;
using Core.Models.Reunioes;
using Data.Entities;
using Data.Repository;
using System.Data.Entity;
using System.Linq;
using Utils.Enums;

namespace Core.Business.Reunioes
{
    public class ReunioesBusiness : IReunioesBusiness
    {
        private readonly IGenericRepository<ReuniaoEvento> reuniaoRepository;
        private readonly IEquipesBusiness equipesBusiness;
        private readonly IGenericRepository<Equipante> equipanteRepository;

        public ReunioesBusiness(IGenericRepository<ReuniaoEvento> reuniaoRepository, IGenericRepository<Equipante> equipanteRepository, IEquipesBusiness equipesBusiness)
        {
            this.reuniaoRepository = reuniaoRepository;
            this.equipanteRepository = equipanteRepository;
            this.equipesBusiness = equipesBusiness;
    }

        public void DeleteReuniao(int id)
        {
            reuniaoRepository.Delete(id);
            reuniaoRepository.Save();
        }

        public ReuniaoEvento GetReuniaoAtiva()
        {
            return reuniaoRepository.GetAll().OrderByDescending(x => x.DataReuniao).First();
        }

        public ReuniaoEvento GetReuniaoById(int id)
        {
            return reuniaoRepository.GetById(id);
        }

        public IQueryable<ReuniaoEvento> GetReunioes(int eventoId)
        {
            return reuniaoRepository.GetAll(x => x.EventoId == eventoId).Include(x => x.Presenca);
        }

        public void PostReuniao(PostReuniaoModel model)
        {
            ReuniaoEvento reuniao = null;

            if (model.Id > 0)
            {
                reuniao = reuniaoRepository.GetById(model.Id);
                reuniao.Link = model.Link;
                reuniao.Descricao = model.Descricao;
                reuniao.DataReuniao = model.DataReuniao.AddHours(4);

                reuniaoRepository.Update(reuniao);
            }
            else
            {
                reuniao = new ReuniaoEvento
                {
                    DataReuniao = model.DataReuniao.AddHours(4),
                    Link = model.Link,
                    Descricao = model.Descricao,
                    EventoId = model.EventoId,
                    Status = StatusEnum.Ativo
                };

                reuniaoRepository.Insert(reuniao);
            }

            reuniaoRepository.Save();
        }
    }
}
