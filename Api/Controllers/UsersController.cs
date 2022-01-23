using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Api.Data;
using Api.DTOs;
using Api.Entities;
using Api.Extensions;
using Api.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Api.Helpers;

namespace Api.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            this._photoService = photoService;
            this._mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            userParams.CurrentUsername = user.UserName;

            // TODO:  this needs to be moved out of controller
            if (string.IsNullOrEmpty(userParams.Gender))
            {
                switch(user.Gender)
                {
                    case "male":
                        userParams.Gender = "female";
                        break;
                    case "female":
                        userParams.Gender = "male";
                        break;
                    default:
                        userParams.Gender = "non-binary";
                        break;
                }
            }
            
            var users = await _userRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(users);

            // return Ok(await _userRepository.GetMembersAsync(userParams));

            // // var users = await _userRepository.GetUsersAsync();
            // // var members = _mapper.Map<IEnumerable<MemberDto>>(users);

            // // return Ok(members);
        }

        // [HttpGet("{id}")]
        // public async Task<ActionResult<AppUser>> GetUser(int id)
        // {
        //     return await _userRepository.GetUserByIdAsync(id);
        // }

        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string userName)
        {
            return await _userRepository.GetMemberAsync(userName);

            // var user = await _userRepository.GetUserByUsernameAsync(userName);
            // var member = _mapper.Map<MemberDto>(user);

            // return member;
        }

        [HttpPut()]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdate)
        {
            if (ModelState.IsValid)
            {
                var username = User.GetUsername();
                var user = await _userRepository.GetUserByUsernameAsync(username);

                _mapper.Map(memberUpdate, user);
                _userRepository.Update(user);

                if (await _userRepository.SaveAllAsync())
                    return NoContent();
            }

            return BadRequest();
        }

        [HttpPut("set-primary-photo/{photoId}")]
        public async Task<ActionResult> SetPrimaryPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            
            foreach (var photo in user.Photos)
            {
                photo.IsPrimary = false;
            }

            user.Photos.FirstOrDefault(x => x.Id == photoId).IsPrimary = true;

            if (await _userRepository.SaveAllAsync())
                return NoContent();
            
            return BadRequest("Ack, couldn't set primary photo");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null)
                return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0)
                photo.IsPrimary = true;

            user.Photos.Add(photo);

            if (await _userRepository.SaveAllAsync())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Can't upload photo for some reason :(");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null)
                return NotFound();

            if (photo.IsPrimary)
                return BadRequest("Can't delete your primary photo");

            if (!string.IsNullOrWhiteSpace(photo.PublicId))
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);

                if (result.Error != null)
                    return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if (await _userRepository.SaveAllAsync())
                return Ok();

            return BadRequest("Can't delete photo  :(");
        }
    }
}