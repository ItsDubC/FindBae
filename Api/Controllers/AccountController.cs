using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Api.Data;
using Api.DTOs;
using Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        public AccountController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AppUser>> Register(RegisterUserDto registerUser)
        {
            if (await UserExists(registerUser.Username))
            {
                return BadRequest("Username is already taken");
            }

            using var hmac = new HMACSHA512();

            var newUser = new AppUser
            {
                UserName = registerUser.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerUser.Password)),
                PasswordSalt = hmac.Key
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(LoginUserDto loginUser)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == loginUser.Username);

            if (user == null)
                return Unauthorized("Invalid username");
            
            using var hmac = new HMACSHA512(user.PasswordSalt);

            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginUser.Password));

            for (int i = 0; i < hash.Length; i++)
            {
                if (hash[i] != user.PasswordHash[i])
                    return Unauthorized("Invalid password");
            }

            return user;
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        } 
    }
}