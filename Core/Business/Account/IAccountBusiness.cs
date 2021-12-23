using Core.Models.Eventos;
using Core.Models.Playground;
using Data.Context;
using Data.Entities;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using System.Linq;

namespace Core.Business.Account
{
    public interface IAccountBusiness
    {
        void Seed();
        IQueryable<ApplicationUser> GetUsuarios();
        List<Equipante> GetEquipantesUsuario(string idUsuario);
        IQueryable<Playground> GetPlaygrounds(int id);
        ApplicationUser GetUsuarioById(string id);
        ApplicationUser GetUsuarioByParticipanteId(int id);
        void ToggleUsuarioStatus(string id);
        void SetSenha(int participanteId, string senha);
        void PostPlayground(PostPlaygroundModel model);
        void DeletePlayground(int id);
    }
}
