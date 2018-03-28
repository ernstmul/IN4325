using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace RelevanceProcessing
{
    public class Program
    {
        public static readonly string FILE_INPUT = @"C:\Users\Remco de Vos\Documents\TU Delft Computer Science\in4325-information_retrieval\project\data\relevance_judgements.txt";
        public static readonly string FILE_OUTPUT = @"C:\Users\Remco de Vos\Documents\TU Delft Computer Science\in4325-information_retrieval\project\data\relevance_judgements_processed.txt";
        public static readonly IEnumerable<string> TOPIC_IDS = new string[] { "310", "336", "362", "367", "383", "426", "427", "436" };
        public static readonly string SUBSET = "NYT";

        static void Main(string[] args)
        {
            Console.WriteLine($"Processing input file {FILE_INPUT}");
            IEnumerable<string> lines = File.ReadLines(FILE_INPUT);
            Console.WriteLine($"Loaded {lines.Count()} lines");
            ICollection<string> output = new List<string>();
            foreach (string line in lines)
            {
                string[] components = line.Split(" ");
                if (TOPIC_IDS.Contains(components[0]) && components[2].Contains(SUBSET))
                {
                    output.Add(line);
                }
            }
            Console.WriteLine($"Writing {output.Count} lines to {FILE_OUTPUT}");
            File.WriteAllLines(FILE_OUTPUT, output);
            Console.WriteLine("Finished processing");
        }
    }
}
