namespace backend.Models
{
    public class Artwork
    {
        public int Id { get; set; } // PK
        public string? Asset_Num { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Dimensions { get; set; }
        public string? Description { get; set; }
        public double? Retail_Low_Estimate { get; set; }
        public double? Retail_High_Estimate { get; set; }

        // Foreign Keys
        public int? Collection_Id { get; set; }
        public int? Category_Id { get; set; }
        public int? Artist_Id { get; set; }
        public int? Medium_Id { get; set; }
        public int? Location_Id { get; set; }
        public int? Loan_Status_Id { get; set; }
        public int? Donor_Id { get; set; }

        // Relationships
        public Collection? Collection { get; set; }
        public Category? Category { get; set; }
        public Artist? Artist { get; set; }
        public Medium? Medium { get; set; }
        public Location? Location { get; set; }
        public Loan_Status? Loan_Status { get; set; }
        public Donor? Donor { get; set; }

        public ICollection<Image> Images { get; set; } = new List<Image>();
    }
}