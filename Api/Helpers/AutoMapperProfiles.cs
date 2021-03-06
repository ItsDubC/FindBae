using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.DTOs;
using Api.Entities;
using Api.Extensions;
using AutoMapper;

namespace Api.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {       
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.PhotoUrl, 
                    opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsPrimary).Url))
                .ForMember(dest => dest.Age,
                    opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<MemberDto, MemberUpdateDto>();
            CreateMap<RegisterUserDto, AppUser>();
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.SenderUsername,
                    opt => opt.MapFrom(src => src.Sender.UserName))
                .ForMember(dest => dest.RecipientUsername,
                    opt => opt.MapFrom(src => src.Recipient.UserName))
                .ForMember(dest => dest.SenderPhotoUrl,
                    opt => opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(x => x.IsPrimary).Url))
                .ForMember(dest => dest.RecipientPhotoUrl,
                    opt => opt.MapFrom(src => src.Recipient.Photos.FirstOrDefault(x => x.IsPrimary).Url)
            );
        }
    }
}