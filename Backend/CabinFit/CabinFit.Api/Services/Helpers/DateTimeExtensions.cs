namespace CabinFit.Api.Services.Helpers
{
    public static class DateTimeExtensions
    {
        public static DateTime AddBusinessDays(this DateTime date, int days)
        {
            var result = date;

            while (days > 0)
            {
                result = result.AddDays(1);

                if (result.DayOfWeek != DayOfWeek.Saturday &&
                    result.DayOfWeek != DayOfWeek.Sunday)
                {
                    days--;
                }
            }

            return result;
        }
    }
}
