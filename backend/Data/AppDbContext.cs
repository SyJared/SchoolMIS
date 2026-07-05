// Data/AppDbContext.cs
using backend.Model;
using Microsoft.EntityFrameworkCore;
using model;
using Model;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Student> Students { get; set; }
        public DbSet<Users> Users { get; set; }

        public DbSet<Classroom> Classrooms { get; set; }

        public DbSet<ClassroomStudents> ClassroomsStudents { get; set; }

        public DbSet<Classes> Classes { get; set; }
    }
}