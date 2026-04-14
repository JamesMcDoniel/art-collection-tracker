namespace backend.Models
{
    public class Report
    {
        public int Id { get; set; } // PK
        public string Title { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public bool ExternalReport { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public bool? OmitEstimates { get; set; }

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
    }
}