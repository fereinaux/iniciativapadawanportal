using Core.Models.Eventos;
using Core.Models.Playground;
using Data.Context;
using Data.Entities;
using Data.Repository;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Threading;
using Utils.Constants;
using Utils.Enums;
using Utils.Extensions;

namespace Core.Business.Account
{
    public class AccountBusiness : IAccountBusiness
    {
        private readonly IGenericRepository<ApplicationUser> accountRepository;
        private readonly IGenericRepository<Equipante> equipanteRepository;
        private readonly IGenericRepository<Playground> playgroundRepository;
        private readonly ApplicationDbContext context;

        public AccountBusiness(IGenericRepository<ApplicationUser> accountRepository, IGenericRepository<Equipante> equipanteRepository, IGenericRepository<Playground> playgroundRepository, ApplicationDbContext context)
        {
            this.accountRepository = accountRepository;
            this.playgroundRepository = playgroundRepository;
            this.equipanteRepository = equipanteRepository;
            this.context = context;
        }

        public List<Equipante> GetEquipantesUsuario(string idUsuario)
        {


            return null;
        }

        public ApplicationUser GetUsuarioById(string id)
        {
            return accountRepository.GetById(id);
        }

        public IQueryable<ApplicationUser> GetUsuarios()
        {
            return accountRepository.GetAll();
        }

        public void PostPlayground(PostPlaygroundModel model)
        {
            if (model.Id > 0)
            {
                var playground = playgroundRepository.GetById(model.Id);
                playground.Codigo = model.Codigo;
                playgroundRepository.Update(playground);
            }
            else
            {
                Playground playground = new Playground
                {
                    Codigo = model.Codigo,
                    Nome = model.Nome,
                    UsuarioId = model.ParticipanteId > 0 ? GetUsuarioByParticipanteId(model.ParticipanteId).Id : Thread.CurrentPrincipal.Identity.GetUserId(),
                };
                playgroundRepository.Insert(playground);
            }

            playgroundRepository.Save();

        }
        public void ToggleUsuarioStatus(string id)
        {
            ApplicationUser usuario = accountRepository.GetById(id);

            StatusEnum status = usuario.Status == StatusEnum.Ativo ?
                StatusEnum.Inativo :
                StatusEnum.Ativo;

            usuario.Status = status;

            accountRepository.Update(usuario);
            accountRepository.Save();
        }

        public void Seed()
        {
            ApplicationUser master = new ApplicationUser
            {
                Id = Usuario.MasterId,
                Email = "felipereinaux@gmail.com",
                UserName = "master",
                PasswordHash = "AMYItPuKcpqwK3/O+FMtVYMpwXnAT1+txuT/rxT8s6eOcHKML4AbRbS2S7JJOg/E1w==",
                SecurityStamp = "d857dd21-e90e-4f09-897f-1dc8532a461e",
                Senha = "master",
                Status = StatusEnum.Ativo,
                Perfil = PerfisUsuarioEnum.Master,
                EmailConfirmed = true,
                PhoneNumberConfirmed = true
            };

            context.Users.AddOrUpdate(x => x.Id, master);

            context.Roles.AddOrUpdate(x => x.Name,
                 new IdentityRole { Name = PerfisUsuarioEnum.Master.GetDescription() },
                 new IdentityRole { Name = PerfisUsuarioEnum.Admin.GetDescription() },
                 new IdentityRole { Name = PerfisUsuarioEnum.Monitor.GetDescription() },
                 new IdentityRole { Name = PerfisUsuarioEnum.Aluno.GetDescription() }
                 );

            context.SaveChanges();

            var UserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            UserManager.AddToRole(master.Id, PerfisUsuarioEnum.Master.GetDescription());

            context.SaveChanges();
        }

        public ApplicationUser GetUsuarioByParticipanteId(int id)
        {
            return accountRepository.GetAll(x => x.ParticipanteId == id).FirstOrDefault();
        }

        public void DeletePlayground(int id)
        {

            playgroundRepository.Delete(id);
            playgroundRepository.Save();

        }

        public IQueryable<Playground> GetPlaygrounds(int id)
        {
            var usuarioId = id > 0 ? GetUsuarioByParticipanteId(id).Id : Thread.CurrentPrincipal.Identity.GetUserId();
            return playgroundRepository.GetAll(x => x.UsuarioId == (usuarioId));
        }

        public void SetSenha(int participanteId, string senha)
        {
            ApplicationUser usuario = GetUsuarioByParticipanteId(participanteId);

      
            usuario.PasswordHash = senha;

            accountRepository.Update(usuario);
            accountRepository.Save();
        }
    }
}
