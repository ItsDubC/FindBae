namespace Api.Entities
{
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsPrimary { get; set; }
        public string PublicId { get; set; }
    }
}