using Arquitetura.Controller;
using Core.Business.Account;
using Core.Business.Eventos;
using Core.Business.Participantes;
using Core.Business.Reunioes;
using Core.Models.Reunioes;
using SysIgreja.ViewModels;
using System.Linq;
using System.Web.Mvc;
using Utils.Constants;
using Utils.Extensions;

namespace SysIgreja.Controllers
{

    [Authorize(Roles = Usuario.Master + "," + Usuario.Admin + "," + Usuario.Aluno)]
    public class ReuniaoController : SysIgrejaControllerBase
    {
        private readonly IReunioesBusiness reuniaosBusiness;
        private readonly IParticipantesBusiness participantesBusiness;

        public ReuniaoController(IReunioesBusiness ReuniaosBusiness, IParticipantesBusiness participantesBusiness, IEventosBusiness eventosBusiness, IAccountBusiness accountBusiness) :base(eventosBusiness, accountBusiness)
        {
            this.reuniaosBusiness = ReuniaosBusiness;
            this.participantesBusiness = participantesBusiness;
        }

        public ActionResult Index()
        {
            ViewBag.Title = "Aulas";
            GetEventos();

            return View();
        }

        [HttpPost]
        public ActionResult GetReunioes(int? EventoId)
        {
            var user = GetApplicationUser();
            var participante = participantesBusiness.GetParticipanteById(user.ParticipanteId ?? 0);
            var verificar = participante != null;
            var result = reuniaosBusiness
                .GetReunioes(EventoId ?? participante.EventoId)
                .Where(x => verificar ? x.DataReuniao <= System.DateTime.Today : 1 ==1)
                .ToList()
                .Select(x => new ReuniaoViewModel
                {
                    Id = x.Id,
                    Link = x.Link,
                    DataReuniao = x.DataReuniao,
                    Presenca = x.Presenca.Count(),
                    QtdAnexos = x.Arquivos.Count()
                });

            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetReuniao(int Id)
        {
            var result = reuniaosBusiness.GetReuniaoById(Id);

            return Json(new { Reuniao = new ReuniaoViewModel {DataReuniao = result.DataReuniao, Link = result.Link, Id = result.Id } }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult PostReuniao(PostReuniaoModel model)
        {
            reuniaosBusiness.PostReuniao(model);

            return new HttpStatusCodeResult(200);
        }

        [HttpPost]
        public ActionResult DeleteReuniao(int Id)
        {
            reuniaosBusiness.DeleteReuniao(Id);

            return new HttpStatusCodeResult(200);
        }
    }
}