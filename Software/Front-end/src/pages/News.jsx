import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState("publication_date");
  const [error, setError] = useState(null);

  // Fetch news articles from Django backend
  const fetchNews = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch("http://localhost:8000/api/news/"); // Assign the fetch result to 'response'
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setNews(data);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to fetch news from the news table.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Sort news articles based on selected sorting option
  const sortedNews = [...news].sort((a, b) => {
    switch (selectedSort) {
      case "publication_date":
        return new Date(b.publication_date) - new Date(a.publication_date);
      case "author":
        return a.author.localeCompare(b.author);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="container px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Latest News</h1>
      <h3 className="text-gray-500 mb-8">Stay informed with real-time updates and critical information.</h3>

      {/* Sorting Radio Buttons */}
      <div className="mb-8">
        <h4 className="font-medium">Sort by:</h4>
        <div className="flex items-center gap-6">
          <div>
            <input
              type="radio"
              id="sort-by-date"
              value="publication_date"
              checked={selectedSort === "publication_date"}
              onChange={() => setSelectedSort("publication_date")}
              className="mr-2"
            />
            <label htmlFor="sort-by-date" className="text-sm">Publication Date</label>
          </div>
          <div>
            <input
              type="radio"
              id="sort-by-author"
              value="author"
              checked={selectedSort === "author"}
              onChange={() => setSelectedSort("author")}
              className="mr-2"
            />
            <label htmlFor="sort-by-author" className="text-sm">Author</label>
          </div>
          <div>
            <input
              type="radio"
              id="sort-by-title"
              value="title"
              checked={selectedSort === "title"}
              onChange={() => setSelectedSort("title")}
              className="mr-2"
            />
            <label htmlFor="sort-by-title" className="text-sm">Title</label>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600">{error}</p>}

      {/* News Cards */}
      {loading ? (
        <p>Loading news...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedNews.length > 0 ? (
            sortedNews.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="object-cover w-full h-64" 
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{article.author}</Badge>
                    <time className="text-sm text-muted-foreground">{article.publication_date}</time>
                  </div>
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={`/news/${article.id}`}>
                    <Button className="w-full">Read More</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No news articles available.</p>
          )}
        </div>
      )}
    </div>
  );
}
