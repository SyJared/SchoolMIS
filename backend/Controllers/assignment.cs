using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AssignmentController : ControllerBase
{
    private readonly AssignmentService _service;

    public AssignmentController(AssignmentService service)
    {
        _service = service;
    }
    [Authorize(Roles ="Teacher,Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateAssignmentDto dto)
    {
        var assignment = await _service.Create(dto);

        return Ok(assignment);
    }
    [Authorize(Roles = "Teacher,Admin,Student")]
    [HttpGet("{classroomId}")]
    public async Task<IActionResult> GetAssignments(int classroomId)
    {
        var assignments = await _service.GetAssignments(classroomId);

        return Ok(assignments);
    }
    [Authorize(Roles ="Teacher,Admin")]
    [HttpPatch]
    public async Task<IActionResult>UpdateAssignment([FromForm]UpdateAssignmentDto dto)
    {
        var assignment = await _service.UpdateAssignment(dto);
        return Ok(assignment);
    }
    [Authorize(Roles = "Teacher,Admin")]
    [HttpDelete("{assignmentId}")]
    public async Task<IActionResult> DeleteAssignment(int assignmentId)
    {
        await _service.DeleteAssignment(assignmentId);
        return Ok();
    }

}