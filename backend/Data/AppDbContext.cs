// Data/AppDbContext.cs
using backend.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
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
        public DbSet<Assignments> Assignments { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Question { get; set; }
        public DbSet<Choice> Choices { get; set; }
        public DbSet<QuizAttempt> QuizAttempts { get; set; }
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

            modelBuilder.Entity<AssignmemtSubmission>()
                .Property(c => c.SubmittedAt)
                .HasColumnType("timestamp without time zone");

            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Attendance>()
            .HasOne(a => a.Class)
            .WithMany(c => c.Attendances)
            .HasForeignKey(a => a.ClassId);

            var utcConverter = new ValueConverter<DateTime, DateTime>(
                v => v.Kind == DateTimeKind.Utc ? v : DateTime.SpecifyKind(v, DateTimeKind.Utc),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
            );

            var nullableUtcConverter = new ValueConverter<DateTime?, DateTime?>(
                v => v.HasValue
                    ? (v.Value.Kind == DateTimeKind.Utc ? v.Value : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc))
                    : v,
                v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v
            );

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime))
                    {
                        property.SetValueConverter(utcConverter);
                    }
                    else if (property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(nullableUtcConverter);
                    }
                }
            }
        }
    }
}