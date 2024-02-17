using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

[Route("api/[controller]")]
[ApiController]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<Users> _userManager;

    public TasksController(ApplicationDbContext context, UserManager<Users> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("get/{ThemeTaskId}")]
public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks(int ThemeTaskId)
{
    
        var currentTheme = await _context.Tasks.FirstOrDefaultAsync(task => task.ThemeTaskId == ThemeTaskId);

        if (currentTheme == null)
        {
            return NotFound("Задачи не найдены"); 
        }

        var userTasks = await _context.Tasks
            .Where(task => task.ThemeTaskId == ThemeTaskId)
            .AsNoTracking()
            .ToListAsync();

        return userTasks;
    
   
}


    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItem>> GetTask(int id)
    {
        var taskItem = await _context.Tasks.FindAsync(id);

        if (taskItem == null)
        {
            return NotFound();
        }

        return taskItem;
    }

    [HttpPost]
    public async Task<ActionResult<TaskItem>> PostTask([FromBody] TaskItem taskItem)
    {
        var user = await _context.Users.FindAsync(taskItem.UsersId);
        var themeTask = await _context.ThemeTasks.FindAsync(taskItem.ThemeTaskId);

        if (user == null || themeTask == null)
        {
            return NotFound("User or ThemeTask not found");
        }

        taskItem.Users = user;
        taskItem.ThemeTask = themeTask;

        _context.Tasks.Add(taskItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTask), new { id = taskItem.Id }, taskItem);
    }

  [HttpPut("{id}")]
public async Task<IActionResult> PutTask(int id, TaskItem taskItem)
{
    if (id != taskItem.Id)
    {
        return BadRequest("Некорректный идентификатор задачи");
    }

    _context.Entry(taskItem).State = EntityState.Modified;

    try
    {
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        if (TaskItemExists(id))
        {
            return BadRequest("Ошибка при обновлении задачи");
        }
        else
        {
            return NotFound("Задача не найдена");
        }
    }

    // Возвращаем обновленную задачу или другую информацию, если необходимо
    return NoContent();
}

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var taskItem = await _context.Tasks.FindAsync(id);

        if (taskItem == null)
        {
            return NotFound();
        }

        _context.Tasks.Remove(taskItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TaskItemExists(int id)
    {
        return _context.Tasks.Any(e => e.Id == id);
    }
}
