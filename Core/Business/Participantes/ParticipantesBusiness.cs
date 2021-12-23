using Core.Business.Circulos;
using Core.Business.Eventos;
using Core.Business.Quartos;
using Core.Models.Participantes;
using Data.Entities;
using Data.Repository;
using System.Linq;
using System.Data.Entity;
using Utils.Enums;
using System;
using Data.Context;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Utils.Extensions;
using Core.Business.Account;
using System.Threading;

namespace Core.Business.Participantes
{
    public class ParticipantesBusiness : IParticipantesBusiness
    {
        private readonly IGenericRepository<Participante> participanteRepository;
        private readonly IGenericRepositoryConsulta<ParticipanteConsulta> participanteConsultaRepository;
        private readonly IGenericRepository<EquipanteEvento> equipanteEventoRepository;
        private readonly IEventosBusiness eventosBusiness;
        private readonly ICirculosBusiness circulosBusiness;
        private readonly IAccountBusiness accountBusiness;
        private readonly IQuartosBusiness quartosBusiness;

        public ParticipantesBusiness(IGenericRepository<Participante> participanteRepository, IAccountBusiness accountBusiness, IGenericRepositoryConsulta<ParticipanteConsulta> participanteConsultaRepository, IQuartosBusiness quartosBusiness, IEventosBusiness eventosBusiness, ICirculosBusiness circulosBusiness, IGenericRepository<EquipanteEvento> equipanteEventoRepository)
         : this(new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext())))
        {
            this.participanteRepository = participanteRepository;
            this.participanteConsultaRepository = participanteConsultaRepository;
            this.equipanteEventoRepository = equipanteEventoRepository;
            this.eventosBusiness = eventosBusiness;
            this.quartosBusiness = quartosBusiness;
            this.accountBusiness = accountBusiness;
            this.circulosBusiness = circulosBusiness;
        }

        public ParticipantesBusiness(UserManager<ApplicationUser> userManager)
        {
            UserManager = userManager;
        }

        public UserManager<ApplicationUser> UserManager { get; private set; }

        public void CancelarInscricao(int id)
        {
            Participante participante = participanteRepository.GetById(id);
            participante.Status = StatusEnum.Cancelado;
            circulosBusiness.ChangeCirculo(id, null);
            quartosBusiness.ChangeQuarto(id, null);

            var emEspera = participanteRepository.GetAll().Where(x => x.Status == StatusEnum.Espera).OrderBy(x => x.Id).FirstOrDefault();

            if (emEspera != null && participanteRepository.GetAll().Where(x => x.Status == StatusEnum.Confirmado || x.Status == StatusEnum.Inscrito).Count() - 1 < eventosBusiness.GetEventoById(participante.EventoId).Capacidade)
            {
                emEspera.Status = StatusEnum.Inscrito;
                participanteRepository.Update(emEspera);
            }

            participanteRepository.Update(participante);
            participanteRepository.Save();
        }

        public Data.Entities.Participante GetParticipanteById(int id)
        {
            return participanteRepository.GetAll(x => x.Id == id).Include(x => x.Evento).SingleOrDefault();
        }

        public Participante GetParticipanteByReference(string reference)
        {
            return participanteRepository.GetAll(x => x.ReferenciaPagSeguro == reference).Include(x => x.Evento).SingleOrDefault();
        }

        public IQueryable<Participante> GetParticipantes()
        {
            return participanteRepository.GetAll().Include(x => x.Evento);
        }

        private ParticipanteConsulta MapUpdateParticipanteConsulta(ParticipanteConsulta entity, PostInscricaoModel model)
        {

            entity.Nome = model.Nome;
            entity.Apelido = model.Apelido;
            entity.DataNascimento = model.DataNascimento.AddHours(5);
            entity.Fone = model.Fone;
            entity.Email = model.Email;
            entity.Sexo = model.Sexo;
            return entity;

        }


        public int PostInscricao(PostInscricaoModel model)
        {
            Participante participante = null;
            if (model.Id > 0)
            {
                participante = MapUpdateParticipante(model);

                var passwordhash = UserManager.PasswordHasher.HashPassword(model.Senha);
                accountBusiness.SetSenha(model.Id, passwordhash);
          
                participanteRepository.Update(participante);
            }
            else
            {
                participante = MapCreateParticipante(model);
                participanteRepository.Insert(participante);
            }

            var participanteConsulta = GetParticipanteConsulta(model.Email);
            if (participanteConsulta != null)
            {
                participanteConsultaRepository.Update(MapUpdateParticipanteConsulta(participanteConsulta, model));
            }
            else
            {
                var participanteConsultaModel = MapCreateParticipanteConsulta(model);
                participanteConsultaRepository.Insert(participanteConsultaModel);
            }

            participanteConsultaRepository.Save();
            participanteRepository.Save();

            CheckIn(participante, model.CancelarCheckin);

            return participante.Id;
        }

        private void CheckIn(Participante participante, bool cancelarCheckin)
        {
            if (participante.Checkin)
            {
                ManageCirculo(participante);
                ManageQuarto(participante);
            }
            else
            {
                if (cancelarCheckin)
                {
                    circulosBusiness.ChangeCirculo(participante.Id, null);
                    quartosBusiness.ChangeQuarto(participante.Id, null);
                }
            }
        }

        private void ManageQuarto(Participante participante)
        {
            if (!quartosBusiness
                              .GetQuartosComParticipantes(participante.EventoId)
                              .Where(x => x.ParticipanteId == participante.Id)
                              .Any())
            {
                var quarto = quartosBusiness.GetNextQuarto(participante.EventoId, participante.Sexo);
                if (quarto != null)
                    quartosBusiness.ChangeQuarto(participante.Id, quarto.Id);
            }
        }

        private void ManageCirculo(Participante participante)
        {
            if (!circulosBusiness
                                .GetCirculosComParticipantes(participante.EventoId)
                                .Where(x => x.ParticipanteId == participante.Id)
                                .Any())
            {
                var circulo = circulosBusiness.GetNextCirculo(participante.EventoId);
                if (circulo != null)
                    circulosBusiness.ChangeCirculo(participante.Id, circulo.Id);
            }
        }

        private Participante MapUpdateParticipante(PostInscricaoModel model)
        {
            Participante participante = participanteRepository.GetById(model.Id);
            participante.Nome = model.Nome;
            participante.Apelido = model.Apelido;
            participante.DataNascimento = model.DataNascimento.AddHours(5);
            participante.Fone = model.Fone;
            participante.Logradouro = model.Logradouro;
            participante.Complemento = model.Complemento;
            participante.Bairro = model.Bairro;
            participante.NomePai = model.NomePai;
            participante.FonePai = model.FonePai;
            participante.NomeMae = model.NomeMae;
            participante.FoneMae = model.FoneMae;
            participante.Github = model.NomeConvite;
            participante.Senha = model.Senha;
            participante.FoneConvite = model.FoneConvite;
            participante.Sexo = model.Sexo;
            participante.HasAlergia = model.HasAlergia;
            participante.Alergia = model.HasAlergia ? model.Alergia : null;
            participante.HasMedicacao = model.HasMedicacao;
            participante.Medicacao = model.HasMedicacao ? model.Medicacao : null;
            participante.HasRestricaoAlimentar = model.HasRestricaoAlimentar;
            participante.RestricaoAlimentar = model.HasRestricaoAlimentar ? model.RestricaoAlimentar : null;
            participante.Checkin = model.Checkin;
            return participante;
        }

        private Equipante getNextPadrinho(int eventoid)
        {

            return null;

        }

        private Participante MapCreateParticipante(PostInscricaoModel model)
        {
            return new Participante
            {
                Nome = model.Nome,
                Apelido = model.Apelido,
                DataNascimento = model.DataNascimento.AddHours(5),
                Fone = model.Fone,
                Email = model.Email,
                Logradouro = model.Logradouro,
                Complemento = model.Complemento,
                Bairro = model.Bairro,
                NomePai = model.NomePai,
                FonePai = model.FonePai,
                NomeMae = model.NomeMae,
                FoneMae = model.FoneMae,
                Github = model.NomeConvite,
                FoneConvite = model.FoneConvite,
                ReferenciaPagSeguro = Guid.NewGuid().ToString(),
                Sexo = model.Sexo,
                Status = model.Status == "Espera" ? StatusEnum.Espera : StatusEnum.Inscrito,
                HasAlergia = model.HasAlergia,
                Alergia = model.HasAlergia ? model.Alergia : null,
                HasMedicacao = model.HasMedicacao,
                Medicacao = model.HasMedicacao ? model.Medicacao : null,
                HasRestricaoAlimentar = model.HasRestricaoAlimentar,
                RestricaoAlimentar = model.HasRestricaoAlimentar ? model.RestricaoAlimentar : null,
                EventoId = model.EventoId,
                PendenciaContato = false,
                Boleto = false,
                PendenciaBoleto = false,
                Checkin = model.Checkin
            };
        }


        private ParticipanteConsulta MapCreateParticipanteConsulta(PostInscricaoModel model)
        {
            return new ParticipanteConsulta
            {
                Nome = model.Nome,
                Apelido = model.Apelido,
                DataNascimento = model.DataNascimento.AddHours(5),
                Fone = model.Fone,
                Email = model.Email,
                Logradouro = model.Logradouro,
                Complemento = model.Complemento,
                Bairro = model.Bairro,
                NomePai = model.NomePai,
                FonePai = model.FonePai,
                NomeMae = model.NomeMae,
                FoneMae = model.FoneMae,
                Sexo = model.Sexo,
                HasAlergia = model.HasAlergia,
                Alergia = model.HasAlergia ? model.Alergia : null,
                HasMedicacao = model.HasMedicacao,
                Medicacao = model.HasMedicacao ? model.Medicacao : null,
                HasRestricaoAlimentar = model.HasRestricaoAlimentar,
                RestricaoAlimentar = model.HasRestricaoAlimentar ? model.RestricaoAlimentar : null,
            };
        }

        public IQueryable<Participante> GetParticipantesByEvento(int eventoId)
        {
            return participanteRepository.GetAll(x => x.EventoId == eventoId).Include(x => x.Evento).Include(x => x.Arquivos);
        }

        public void TogglePendenciaContato(int id)
        {
            var participante = GetParticipanteById(id);
            participante.PendenciaContato = !participante.PendenciaContato;
            participanteRepository.Update(participante);
            participanteRepository.Save();
        }

        public void TogglePendenciaBoleto(int id)
        {
            var participante = GetParticipanteById(id);
            participante.PendenciaBoleto = !participante.PendenciaBoleto;
            participanteRepository.Update(participante);
            participanteRepository.Save();
        }

        public void SolicitarBoleto(int id)
        {
            var participante = GetParticipanteById(id);
            participante.PendenciaBoleto = false;
            participante.Boleto = true;
            participanteRepository.Update(participante);
            participanteRepository.Save();
        }

        public IQueryable<Participante> GetAniversariantesByEvento(int eventoId)
        {
            var data = eventosBusiness.GetEventoById(eventoId).DataEvento;

            return participanteRepository.GetAll(x => x.Status != StatusEnum.Cancelado && x.EventoId == eventoId && x.DataNascimento.Month == data.Month);
        }

        public IQueryable<Participante> GetRestricoesByEvento(int eventoId)
        {
            return participanteRepository.GetAll(x => x.Status != StatusEnum.Cancelado && x.EventoId == eventoId && x.HasRestricaoAlimentar);
        }

        public void ToggleSexo(int id)
        {
            var participante = GetParticipanteById(id);
            participante.Sexo = participante.Sexo == SexoEnum.Feminino ? SexoEnum.Masculino : SexoEnum.Feminino;
            participanteRepository.Update(participante);
            participanteRepository.Save();
        }

        public IQueryable<Participante> GetParentesByEvento(int eventoId)
        {
            return participanteRepository.GetAll(x => x.Status != StatusEnum.Cancelado && x.EventoId == eventoId && x.HasParente.HasValue && x.HasParente.Value);
        }

        public void ToggleVacina(int id)
        {
            var participante = GetParticipanteById(id);
            participante.HasVacina = !participante.HasVacina;
            participanteRepository.Update(participante);
            participanteRepository.Save();
        }

        public void ToggleTeste(int id)
        {
            var participante = GetParticipanteById(id);
            participante.HasTeste = !participante.HasTeste;
            participanteRepository.Update(participante);
            participanteRepository.Save();
        }

        public void ToggleCheckin(int id)
        {
            var participante = GetParticipanteById(id);
            participante.Checkin = !participante.Checkin;
            participanteRepository.Update(participante);
            participanteRepository.Save();

            if (participante.Checkin)
            {
                ManageCirculo(participante);
                ManageQuarto(participante);
            }

        }

        public void PostInfo(PostInfoModel model)
        {
            var participante = GetParticipanteById(model.Id);
            participante.Observacao = model.Observacao;
            participante.MsgVacina = model.MsgVacina;
            participante.MsgGeral = model.MsgGeral;
            participante.MsgCommit = model.MsgCommit;
            participante.MsgFilme = model.MsgFilme;
            participante.MsgSprint = model.MsgSprint;
            participante.MsgAPI = model.MsgAPI;
            participante.MsgPagamento = model.MsgPagamento;
            participante.MsgFoto = model.MsgFoto;
            participante.MsgNoitita = model.MsgNoitita;
            participanteRepository.Update(participante);
            participanteRepository.Save();
        }

        public ParticipanteConsulta GetParticipanteConsulta(string email)
        {
            return participanteConsultaRepository.GetAll(x => x.Email == email).FirstOrDefault();
        }

        public void ConfirmarVaga(int id)
        {
            var participante = GetParticipanteById(id);
            participante.Status = StatusEnum.Confirmado;
            var senha = System.Web.Security.Membership.GeneratePassword(6, 2).ToLower();
            participante.Senha = senha;
            var user = new ApplicationUser() { UserName = participante.Email.ToLower(), ParticipanteId = participante.Id, Status = StatusEnum.Ativo, Perfil = PerfisUsuarioEnum.Aluno, Senha = senha };
            UserManager.Create(user, senha);
            user = UserManager.FindByName(user.UserName);
            UserManager.AddToRole(user.Id, PerfisUsuarioEnum.Aluno.GetDescription());
            participanteRepository.Update(participante);
            participanteRepository.Save();

        }
    }
}
