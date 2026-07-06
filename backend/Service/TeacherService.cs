using backend.Data;
using Microsoft.EntityFrameworkCore;
using model;

public class TeacherService
{
    private readonly AppDbContext _context;

    public TeacherService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<List<Users>> SearchAdvisor(string? search)
    {
        var query = _context.Users
            .Where(u => u.Role == Role.Teacher);

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x => x.Name.Contains(search));
        }

        return await query.ToListAsync();
    }
}