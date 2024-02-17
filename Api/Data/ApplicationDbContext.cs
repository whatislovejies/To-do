using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;


public class ApplicationDbContext : IdentityDbContext<Users, IdentityRole<int>, int, 
    IdentityUserClaim<int>, IdentityUserRole<int>, IdentityUserLogin<int>, 
    IdentityRoleClaim<int>, IdentityUserToken<int>>


{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<TaskItem> Tasks { get; set; }
    public DbSet<ThemeTask> ThemeTasks { get; set; }
    public DbSet<Users> Users { get; set; }
    public DbSet<IdentityUserClaim<int>> UserClaims { get; set; }

   
}
