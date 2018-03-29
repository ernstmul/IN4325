using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml.Linq;

namespace DocumentProcessing
{
    public class Program
    {
        public static readonly string FILE_INPUT = @"C:\Users\Remco de Vos\Documents\TU Delft Computer Science\in4325-information_retrieval\project\data\relevance_judgements_processed.txt";
        public static readonly string DIR_INPUT = @"C:\Users\Remco de Vos\Documents\TU Delft Computer Science\in4325-information_retrieval\project\data\AQUAINT";
        public static readonly string DIR_OUTPUT = @"C:\Users\Remco de Vos\Documents\TU Delft Computer Science\in4325-information_retrieval\project\data\documents_processed";
        public static readonly string XML_FIX = "<!DOCTYPE documentElement[" +
            "<!ENTITY Cx1f \"&#160;\">" +
            "<!ENTITY Cx11 \"&#160;\">" +
            "<!ENTITY Cx12 \"&#160;\">" +
            "<!ENTITY Cx13 \"&#160;\">" +
            "<!ENTITY Cx14 \"&#160;\">" +
            "<!ENTITY UR \"&#160;\">" +
            "<!ENTITY LR \"&#160;\">" +
            "<!ENTITY QL \"&#160;\">" +
            "<!ENTITY QR \"&#160;\">" +
            "<!ENTITY QC \"&#160;\">" +
            "<!ENTITY HT \"&#160;\">" +
            "<!ENTITY AMP \"&amp;\">" +
            "]>";

        static void Main(string[] args)
        {
            Console.WriteLine($"Processing documents based on relevance judgement file {FILE_INPUT}");
            IEnumerable<RelevanceJudgement> relevances = File.ReadAllLines(FILE_INPUT).Select(RelevanceJudgement.FromString);
            ICollection<Document> documents = new List<Document>();

            foreach (RelevanceJudgement item in relevances)
            {
                string path = Path.Combine(DIR_INPUT, item.Subset, item.Year, item.Year + item.FileId + "_" + item.Subset);
                string content = File.ReadAllText(path);
                content = "<DOCS>" + content + "</DOCS>";

                XDocument xdoc = XDocument.Parse(XML_FIX + content);
                XElement xel = xdoc.Root.Elements("DOC").SingleOrDefault(xelement => xelement.Element("DOCNO").Value.Contains(item.DocumentId));
                XElement xbody = xel?.Element("BODY");

                documents.Add(new Document()
                {
                    DocumentId = item.DocumentId,
                    TopicId = item.Subset,
                    Relevance = item.Relevance,
                    Body = xbody.Value,
                    Headline = xbody.Element("HEADLINE")?.Value,
                    Text = xbody.Element("TEXT").Elements("P").Select(p => p.Value).ToList()
                });
            }

            Console.WriteLine($"Found {documents.Count} documents for {relevances.Count()} relevance judgements");
            Console.WriteLine($"Start writing documents to {DIR_OUTPUT}");

            JsonSerializer serializer = new JsonSerializer();
            int writeCount = 0;
            foreach (Document document in documents)
            {
                string directory = Path.Combine(DIR_OUTPUT, document.TopicId, document.Relevance);
                Directory.CreateDirectory(directory);
                using (StreamWriter writer = File.CreateText(Path.Combine(directory, document.DocumentId + ".json")))
                {
                    serializer.Serialize(writer, document);
                    writeCount++;
                }
            }

            Console.WriteLine($"Written {writeCount} documents to file");
            Console.WriteLine("Processing finished");
        }
    }
}
