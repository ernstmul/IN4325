using System.Collections.Generic;

namespace DocumentProcessing
{
    public class Document
    {
        public string DocumentId { get; set; }

        public string TopicId { get; set; }

        public string Relevance { get; set; }

        public string Body { get; set; }

        public string Headline { get; set; }

        public ICollection<string> Text { get; set; }
    }
}
