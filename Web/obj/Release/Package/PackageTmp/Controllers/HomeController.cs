using Arquitetura.Controller;
using Core.Business.Account;
using Core.Business.Arquivos;
using Core.Business.Equipes;
using Core.Business.Eventos;
using Core.Business.Lancamento;
using Core.Business.Participantes;
using Core.Business.Reunioes;
using Core.Models.Participantes;
using SysIgreja.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Utils.Constants;
using Utils.Enums;
using Utils.Extensions;
using Utils.Services;

namespace SysIgreja.Controllers
{

    [Authorize]
    public class HomeController : SysIgrejaControllerBase
    {
        private readonly IEquipesBusiness equipesBusiness;
        private readonly IParticipantesBusiness participantesBusiness;
        private readonly ILancamentoBusiness lancamentoBusiness;
        private readonly IReunioesBusiness reunioesBusiness;
        private readonly IEventosBusiness eventosBusiness;
        private readonly IArquivosBusiness arquivosBusiness;
        private readonly IAccountBusiness accountBusiness;

        public HomeController(IEquipesBusiness equipesBusiness, IParticipantesBusiness participantesBusiness, IArquivosBusiness arquivosBusiness, ILancamentoBusiness lancamentoBusiness, IEventosBusiness eventosBusiness, IAccountBusiness accountBusiness, IReunioesBusiness reunioesBusiness) : base(eventosBusiness, accountBusiness)
        {
            this.lancamentoBusiness = lancamentoBusiness;
            this.participantesBusiness = participantesBusiness;
            this.equipesBusiness = equipesBusiness;
            this.eventosBusiness = eventosBusiness;
            this.accountBusiness = accountBusiness;
            this.reunioesBusiness = reunioesBusiness;
            this.arquivosBusiness = arquivosBusiness;
        }

        [Authorize(Roles = Usuario.Master + "," + Usuario.Admin + "," + Usuario.Monitor)]
        public ActionResult Admin()
        {
            ViewBag.Title = "Sistema de Gestão";

            GetEventos();
            return View();
        }

        private PostInscricaoModel mapParticipante(Data.Entities.Participante x)
        {
            return new PostInscricaoModel
            {
                Alergia = x.Alergia,
                Apelido = x.Apelido,
                Bairro = x.Bairro,
                Senha = x.Senha,
                CancelarCheckin = false,
                Checkin = x.Checkin,
                Complemento = x.Complemento,
                Congregacao = x.Congregacao,
                DataNascimento = x.DataNascimento,
                Email = x.Email,
                EventoId = x.EventoId,
                Fone = x.Fone,
                FoneConvite = x.FoneConvite,
                FoneMae = x.FoneMae,
                FonePai = x.FonePai,
                HasAlergia = x.HasAlergia,
                HasMedicacao = x.HasMedicacao,
                HasTeste = x.HasTeste,
                HasParente = false,
                HasRestricaoAlimentar = x.HasRestricaoAlimentar,
                Id = x.Id,
                Logradouro = x.Logradouro,
                Medicacao = x.Medicacao,
                Nome = x.Nome,
                NomeConvite = x.Github,
                NomeMae = x.NomeMae,
                NomePai = x.NomePai,
                Parente = x.Parente,
                HasVacina = x.HasVacina,
                RestricaoAlimentar = x.RestricaoAlimentar,
                Sexo = x.Sexo,
                Status = x.Status.GetDescription(),
                Observacao = x.Observacao,
                MsgVacina = x.MsgVacina,
                MsgPagamento = x.MsgPagamento,
                Boleto = x.Boleto,
                MsgGeral = x.MsgGeral,
                MsgNoitita = x.MsgNoitita,
                MsgFoto = x.MsgFoto,
                MsgCommit = x.MsgCommit,
                MsgFilme = x.MsgFilme,
                MsgSprint = x.MsgSprint,
                MsgAPI = x.MsgAPI,
                PendenciaBoleto = x.PendenciaBoleto,
                PendenciaContato = x.PendenciaContato,
                Foto = x.Arquivos.Any(y => y.IsFoto) ? x.Arquivos.FirstOrDefault(y => y.IsFoto).Id.ToString() : ""
            };
        }
        [HttpGet]
        public ActionResult GetAlunoInfo()
        {
            var user = GetApplicationUser();
            var participante = mapParticipante(participantesBusiness.GetParticipanteById(user.ParticipanteId ?? 0));

            var result = new { Aluno = participante };
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetResultadosAdmin(int EventoId)
        {
            var result = new
            {
                Evento = eventosBusiness.GetEventoById(EventoId).Status.GetDescription(),
                Confirmados = participantesBusiness.GetParticipantesByEvento(EventoId).Where(x => x.Status == StatusEnum.Confirmado).Count(),
                Cancelados = participantesBusiness.GetParticipantesByEvento(EventoId).Where(x => x.Status == StatusEnum.Cancelado).Count(),
                Espera = participantesBusiness.GetParticipantesByEvento(EventoId).Where(x => x.Status == StatusEnum.Espera).Count(),
                Presentes = participantesBusiness.GetParticipantesByEvento(EventoId).Where(x => x.Checkin).Count(),
                Isencoes = lancamentoBusiness.GetPagamentosEvento(EventoId).ToList().Where(x => x.ParticipanteId != null && x.Tipo == TiposLancamentoEnum.Receber && x.MeioPagamento.Descricao == MeioPagamentoPadraoEnum.Isencao.GetDescription()).Count(),
                Total = participantesBusiness.GetParticipantesByEvento(EventoId).Where(x => x.Status != StatusEnum.Cancelado && x.Status != StatusEnum.Espera).Count(),
                Boletos = participantesBusiness.GetParticipantesByEvento(EventoId).Where(x => x.Boleto && !x.PendenciaBoleto).Count(),
                Contatos = participantesBusiness.GetParticipantesByEvento(EventoId).Where(x => !x.PendenciaContato).Count(),
                Meninos = participantesBusiness.GetParticipantesByEvento(EventoId).Where(x => x.Sexo == SexoEnum.Masculino && x.Status != StatusEnum.Cancelado && x.Status != StatusEnum.Espera).Count(),
                Meninas = participantesBusiness.GetParticipantesByEvento(EventoId).Where(x => x.Sexo == SexoEnum.Feminino && x.Status != StatusEnum.Cancelado && x.Status != StatusEnum.Espera).Count(),
                TotalReceber = UtilServices.DecimalToMoeda(lancamentoBusiness.GetPagamentosEvento(EventoId).Where(x => x.Tipo == TiposLancamentoEnum.Receber).Select(x => x.Valor).DefaultIfEmpty(0).Sum()),
                TotalPagar = UtilServices.DecimalToMoeda(lancamentoBusiness.GetPagamentosEvento(EventoId).Where(x => x.Tipo == TiposLancamentoEnum.Pagar).Select(x => x.Valor).DefaultIfEmpty(0).Sum()),
                UltimosInscritos = participantesBusiness.GetParticipantesByEvento(EventoId).Where(x => x.Status != StatusEnum.Cancelado)
                .OrderByDescending(x => x.DataCadastro).Take(5).ToList().Select(x => new ParticipanteViewModel
                {
                    Nome = UtilServices.CapitalizarNome(x.Nome),
                    Sexo = x.Sexo.GetDescription(),
                    Idade = UtilServices.GetAge(x.DataNascimento)
                }).ToList(),
                Equipes = equipesBusiness.GetEquipes(EventoId).Select(x => new ListaEquipesViewModel
                {
                    Id = x.Id,
                    Equipe = x.Description,
                    QuantidadeMembros = equipesBusiness.GetMembrosEquipe(EventoId, (EquipesEnum)x.Id).Count()
                }).ToList(),
                Reunioes = reunioesBusiness.GetReunioes(EventoId).ToList().Select(x => new ReuniaoViewModel
                {
                    Id = x.Id,
                    DataReuniao = x.DataReuniao,
                    Presenca = x.Presenca.Count()
                }).ToList()
            };

            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetDetalhamentoEvento(int EventoId)
        {
            var result = new
            {
                Equipantes = equipesBusiness
                .GetEquipantesEvento(EventoId)
                .OrderBy(x => x.Equipe)
                .ThenBy(x => x.Tipo)
                .ThenBy(x => x.Equipante.Nome)
                .ToList()
                .Select(x => new
                {
                    Equipe = x.Equipe.GetDescription(),
                    Nome = x.Equipante.Nome,
                    Tipo = x.Tipo.GetDescription(),
                    Fone = x.Equipante.Fone
                })
            };


            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Aluno()
        {

            GetEventos();
            var user = GetApplicationUser();
            var participante = participantesBusiness.GetParticipanteById(user.ParticipanteId ?? 0);
            ViewBag.Title = participante.Nome;
            return View();
        }

        [HttpGet]
        public ActionResult GetPresenca(int ReuniaoId)
        {
            var presenca = equipesBusiness.GetPresenca(ReuniaoId).Select(x => x.ParticipanteId).ToList();

            var user = GetApplicationUser();
            var eventoId = (eventosBusiness.GetEventoAtivo() ?? eventosBusiness.GetEventos().OrderByDescending(x => x.DataEvento).First()).Id;

            var result = equipesBusiness
                .GetMembrosEquipe(eventoId, equipesBusiness.GetEquipanteEventoByUser(eventoId, user.Id).Equipe).ToList().Select(x => new PresencaViewModel
                {
                    Id = x.Id,
                    Nome = x.Equipante.Nome,
                    Presenca = presenca.Contains(x.Id)
                });

            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult TogglePresenca(int EquipanteEventoId, int ReuniaoId)
        {
            equipesBusiness.TogglePresenca(EquipanteEventoId, ReuniaoId);

            return new HttpStatusCodeResult(200);
        }

        public ActionResult Index()
        {
            var user = GetApplicationUser();

            switch (user.Perfil)
            {
                case PerfisUsuarioEnum.Master:
                case PerfisUsuarioEnum.Admin:
                case PerfisUsuarioEnum.Monitor:
                    return RedirectToAction("Admin", "Home");
                case PerfisUsuarioEnum.Aluno:
                    return RedirectToAction("Aluno", "Home");
                default:
                    return RedirectToAction("Admin", "Home");
            }
        }
    }
}