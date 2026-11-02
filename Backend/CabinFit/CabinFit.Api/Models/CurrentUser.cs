namespace CabinFit.Api.Models
{
    public record CurrentUser(string Id, string UserName, IEnumerable<string> Roles)
    {
    }
}
