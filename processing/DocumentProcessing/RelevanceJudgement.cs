
namespace DocumentProcessing
{
    public class RelevanceJudgement
    {
        public string TopicId { get; set; }

        public string Subset { get; set; }

        public string Year { get; set; }

        public string FileId { get; set; }

        public string DocumentNumber { get; set; }

        public string DocumentId { get; set; }

        public string Relevance { get; set; }

        public static RelevanceJudgement FromString(string input)
        {
            string[] components = input.Split(" ");
            string[] fileComponents = components[2].Split(".");

            return new RelevanceJudgement()
            {
                TopicId = components[0],
                Subset = fileComponents[0].Substring(0, 3),
                Year = fileComponents[0].Substring(3, 4),
                FileId = fileComponents[0].Substring(7, 4),
                DocumentNumber = fileComponents[1],
                DocumentId = components[2],
                Relevance = components[3]
            };
        }
    }
}
