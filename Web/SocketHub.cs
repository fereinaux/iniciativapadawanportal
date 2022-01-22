using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web
{
    public class SocketHub : Hub
    {
        public void PopulateCode(string code)
        {
            Clients.All.populateCode(code);          
        }
    }
}