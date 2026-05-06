using ClientProjectSystemLoginCSharp.Repositories;
using ClientProjectSystemLoginCSharp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.IdentityModel.Tokens;
using NHibernate;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var jwtKey = builder.Configuration["Jwt:Key"];

// 1. Verifica se a chave está faltando. Se sim, lança uma exceção informativa.
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("A chave JWT ('Jwt:Key') não foi configurada no appsettings.json e é obrigatória.");
}

// Configura o esquema de Autenticação
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // Opcional: Se necessário, define a validação do Emissor (Issuer)
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            // Opcional: Se necessário, define a validação da Audiência (Audience)
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],

            // OBRIGATÓRIO: Valida a assinatura do token (a chave secreta)
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

            // OBRIGATÓRIO: Valida a expiração do token
            ValidateLifetime = true
        };
    });

// Adiciona os serviços de Autorização
builder.Services.AddAuthorization();

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
builder.Services.AddScoped<IClientService, ClientService>();

// Registrar ClientRepository, e tudo que o ClientService precisa
builder.Services.AddScoped<IClientRepository, ClientRepository>();

builder.Services.AddScoped<StatusService>();

builder.Services.AddScoped<StatusRepository>();

builder.Services.AddScoped<ProjectService>();

builder.Services.AddScoped<ProjectRepository>();

builder.Services.AddScoped<ActivityService>();

builder.Services.AddScoped<ActivityRepository>();

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddScoped<LoginRepository>();

builder.Services.AddScoped<ILoginService, LoginService>();

// Registra o ISessionFactory scoped via NHibernateHelper
builder.Services.AddSingleton(factory => NHibernateHelper.SessionFactory);

// Registra o ISession (por escopo, por requisição)
builder.Services.AddScoped(factory => factory.GetRequiredService<ISessionFactory>().OpenSession());

// Configura controllers
builder.Services.AddControllers(options =>
{
    // Cria uma política que exige AUTENTICAÇÃO
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();

    // Aplica essa política como um filtro global para TODOS os Controllers
    options.Filters.Add(new AuthorizeFilter(policy));
});

var app = builder.Build();

// 🔑 Middleware de Autenticação (DEVE vir antes do UseAuthorization)
app.UseAuthentication();

// 🔑 Middleware de Autorização (DEVE vir antes dos endpoints)
app.UseAuthorization();

app.UseCors();  // <-- esta linha é fundamental para liberar CORS

app.MapControllers();

app.Run();