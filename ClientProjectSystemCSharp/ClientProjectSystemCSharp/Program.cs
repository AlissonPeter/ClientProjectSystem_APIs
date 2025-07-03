using ClientProjectSystemCSharp.Repositories;
using ClientProjectSystemCSharp.Services;
using NHibernate;

var builder = WebApplication.CreateBuilder(args);

// Configura CORS para liberar qualquer origem (equivalente a origins = "*")
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Registrar ClientService no container DI como serviço
builder.Services.AddScoped<ClientService>();

// Registrar ClientRepository, e tudo que o ClientService precisa
builder.Services.AddScoped<ClientRepository>();

builder.Services.AddScoped<StatusService>();

builder.Services.AddScoped<StatusRepository>();

builder.Services.AddScoped<ProjectService>();

builder.Services.AddScoped<ProjectRepository>();

builder.Services.AddScoped<ActivityService>();

builder.Services.AddScoped<ActivityRepository>();

// Registra o ISessionFactory scoped via NHibernateHelper
builder.Services.AddSingleton(factory => NHibernateHelper.SessionFactory);

// Registra o ISession (por escopo, por requisição)
builder.Services.AddScoped(factory => factory.GetRequiredService<ISessionFactory>().OpenSession());

// Configura controllers
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors();  // <-- esta linha é fundamental para liberar CORS

app.MapControllers();

app.Run();