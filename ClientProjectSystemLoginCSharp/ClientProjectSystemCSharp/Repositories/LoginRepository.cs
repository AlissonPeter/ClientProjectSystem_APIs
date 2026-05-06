using ClientProjectSystemLoginCSharp.Models;
using NHibernate.Util;

namespace ClientProjectSystemLoginCSharp.Repositories
{
    public class LoginRepository
    {
        private readonly NHibernate.ISession _session;

        public LoginRepository(NHibernate.ISession session)
        {
            _session = session;
        }
        public List<Login> LoadByUsernamePassword(String username, String password)
        {
            return _session.Query<Login>()
            .Where(c => c.Username == username && c.Password == password)
            .ToList();
        }
    }
}
