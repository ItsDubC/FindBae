using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.DTOs;
using Api.Entities;
using AutoMapper;

namespace Api.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {       
            CreateMap<AppUser, MemberDto>();
            CreateMap<Photo, PhotoDto>();
        }
    }
}