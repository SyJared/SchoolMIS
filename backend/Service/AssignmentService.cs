using backend.Data;
using backend.Model;
using Microsoft.EntityFrameworkCore;

public class AssignmentService
{
    private readonly AppDbContext _context;
    private readonly NotificationService _notificationService;
    private readonly IWebHostEnvironment _env;

    public AssignmentService(
        AppDbContext context,
        IWebHostEnvironment env,
        NotificationService notificationService)
    {
        _context = context;
        _env = env;
        _notificationService = notificationService;
    }

    public async Task<Assignments> Create(CreateAssignmentDto dto)
    {
        string? filePath = null;

        if (dto.File != null)
        {
            if (dto.File.Length == 0)
                throw new Exception("File is empty.");

            var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".ppt", ".pptx" };

            var extension = Path.GetExtension(dto.File.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                throw new Exception("Invalid file type.");

            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "assignments");

            Directory.CreateDirectory(uploads);

            var fileName = Guid.NewGuid() + Path.GetExtension(dto.File.FileName);

            var fullPath = Path.Combine(uploads, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            filePath = $"uploads/assignments/{fileName}";
        }

        var assignment = new Assignments
        {
            ClassroomId = dto.ClassroomId,
            Title = dto.Title,
            Description = dto.Description,
            DueDate = dto.DueDate,
            File = filePath
        };

        _context.Assignments.Add(assignment);

        await _context.SaveChangesAsync();

        await _notificationService.NotifyClassroom(
            dto.ClassroomId,
            NotificationType.AssignmentCreated,
            $"A new assignment \"{assignment.Title}\" has been posted."
        );
        return assignment;
    }

    public async Task<List<AssignmentDto>> GetAssignments(int classroomId)
    {
        return await _context.Assignments
            .Where(a => a.ClassroomId == classroomId)
            .OrderBy(a => a.DueDate)
            .Select(a => new AssignmentDto(
                a.Id,
                a.Title,
                a.Description,
                a.DueDate,
                a.File
            ))
            .ToListAsync();
    }

    public async Task<bool> UpdateAssignment(UpdateAssignmentDto dto)
    {
        var assignment = await _context.Assignments
            .FirstOrDefaultAsync(a => a.Id == dto.Id);

        if (assignment == null)
            return false;

        assignment.Title = dto.Title;
        assignment.Description = dto.Description;
        assignment.DueDate = dto.DueDate;

        if (dto.File != null)
        {
            var uploads = Path.Combine(
                Directory.GetCurrentDirectory(),
                "uploads",
                "assignments");

            Directory.CreateDirectory(uploads);

            // Delete old file (optional but recommended)
            if (!string.IsNullOrEmpty(assignment.File))
            {
                var oldFile = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    assignment.File);

                if (File.Exists(oldFile))
                    File.Delete(oldFile);
            }

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.File.FileName)}";
            var fullPath = Path.Combine(uploads, fileName);

            using var stream = new FileStream(fullPath, FileMode.Create);
            await dto.File.CopyToAsync(stream);

            assignment.File = $"uploads/assignments/{fileName}";
        }

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task DeleteAssignment(int assignmentId)
    {
        var assignment = await _context.Assignments.FirstOrDefaultAsync(c => c.Id == assignmentId);
        if (!string.IsNullOrEmpty(assignment.File))
        {
            var path = Path.Combine(
                Directory.GetCurrentDirectory(),
                assignment.File);

            if (File.Exists(path))
                File.Delete(path);
        }

        _context.Remove(assignment);

        await _context.SaveChangesAsync();
    }
}