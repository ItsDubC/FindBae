using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Entities;

namespace Api.Interfaces
{
    public interface ITokenService
    {
        public string CreateToken(AppUser user);
    }
}