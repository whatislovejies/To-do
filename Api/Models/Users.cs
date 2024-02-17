using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

public class Users : IdentityUser<int>{
    
    public string FirstName { get; set; }

    public string LastName { get; set; }

    [EmailAddress]
    [Required]
    public override string Email { get; set; }
}

