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
        public DbSet<Attendance> Attendance { get; set; }
        public DbSet<Grade> Grades { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Student>()
                .HasOne(s => s.User)
                .WithOne()
                .HasForeignKey<Student>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Classes>()
                .Property(c => c.Start)
                .HasColumnType("timestamp without time zone");

            modelBuilder.Entity<Classes>()
                .Property(c => c.End)
                .HasColumnType("timestamp without time zone");

            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Attendance>()
            .HasOne(a => a.Class)
            .WithMany(c => c.Attendances)
            .HasForeignKey(a => a.ClassId);
        }
    }
}