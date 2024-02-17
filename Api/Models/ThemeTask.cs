using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
public class ThemeTask
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }

    public int UsersId { get; set; }
    public Users Users { get; set; }
}
