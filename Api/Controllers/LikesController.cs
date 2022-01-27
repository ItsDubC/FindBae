using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.DTOs;
using Api.Entities;
using Api.Extensions;
using Api.Helpers;
using Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly ILikesRepository _likesRepository;
        private readonly IUserRepository _userRepository;

        public LikesController(ILikesRepository likesRepository, IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _likesRepository = likesRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes([FromQuery] LikesParams likesParams)
        {
            likesParams.UserId = User.GetUserId();
            var likes = await _likesRepository.GetUserLikes(likesParams);

            Response.AddPaginationHeader(likes.CurrentPage, likes.PageSize, likes.TotalCount, likes.TotalPages);

            return Ok(likes);
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _userRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);

            if (likedUser == null)
                return NotFound();

            if (sourceUser.UserName == username)
                return BadRequest("You can't like yourself  :)");

            var userLike = await _likesRepository.GetUserLike(sourceUserId, likedUser.Id);

            if (userLike != null)
                return BadRequest("You've already liked this person");

            sourceUser.LikedUsers.Add(new UserLike
            {
                SourceUserId = sourceUserId,
                LikedUserId = likedUser.Id
            });

            // _userRepository.Update(sourceUser);
            // await _userRepository.SaveAllAsync();

            // return Ok(); 

            if (await _userRepository.SaveAllAsync())
                return Ok();
            
            return BadRequest("Failed to like user");
        }
    }
}