
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import articlesData from "./BlogPageArticles";
import { useEffect } from "react";

const BlogArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Simulate fetch or import article list
  const article = articlesData.find((art) => String(art.id) === String(id));

  useEffect(() => {
    if (!article) {
      // article not found, redirect to /blog
      navigate("/blog", { replace: true });
    }
  }, [article, navigate]);

  if (!article) return null;

  const Icon = article.icon;
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" asChild className="mb-6">
          <Link to="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
          </Link>
        </Button>
        <Card className="max-w-3xl mx-auto overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full aspect-video object-cover"/>
          <CardHeader>
            <Badge variant="outline" className="mb-2 flex items-center">
              <Icon className="h-4 w-4 mr-1" />
              {article.category}
            </Badge>
            <CardTitle className="text-3xl mb-2">{article.title}</CardTitle>
            <div className="flex gap-6 items-center text-gray-500 text-sm">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(article.date).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {article.author}
              </span>
              <span>{article.readTime}</span>
            </div>
          </CardHeader>
          <CardContent className="prose max-w-none py-4">
            <p>{article.content}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogArticle;
