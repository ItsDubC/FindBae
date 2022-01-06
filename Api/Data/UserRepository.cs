using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Entities;
using Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Api.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        public UserRepository(DataContext context)
        {
            this._context = context;
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
                .Include(x => x.Photos)
                .ToListAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            //return await _context.Users.FindAsync(id);

            return await _context.Users
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string userName)
        {
            return await _context.Users
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.UserName == userName.ToLower());
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}