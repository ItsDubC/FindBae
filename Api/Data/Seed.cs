using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Data
{
    public class Seed
    {
        private static readonly string UserPassword = "Pa$$w0rd";

        public static async Task SeedUsers(DataContext context)
        {
            if (await context.Users.AnyAsync())
                return;

            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();
                context.Users.Add(user);
            }

            await context.SaveChangesAsync();
        }
    }
}