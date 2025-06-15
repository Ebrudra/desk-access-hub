import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, ArrowRight, TrendingUp, Users, Lightbulb, Target } from "lucide-react";
import { Link } from "react-router-dom";
import articles from "./BlogPageArticles";

const BlogPage = () => {
  const categories = ["All", "Analytics", "Community", "Design", "Business"];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">WorkspaceHub</span>
            </Link>
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Coworking Success Stories &amp; Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Learn from industry experts and successful space operators. Discover proven strategies, 
            data-driven insights, and actionable tips to grow your coworking business.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="outline" className="px-3 py-1">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">Featured Article</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Insights</h2>
            </div>
            <Card className="overflow-hidden">
              <div className="aspect-video w-full">
                <img 
                  src={articles[0].image} 
                  alt={articles[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">
                    {(() => {
                      const Icon = articles[0].icon;
                      return <Icon className="h-3 w-3 mr-1" />;
                    })()}
                    {articles[0].category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(articles[0].date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {articles[0].author}
                    </span>
                    <span>{articles[0].readTime}</span>
                  </div>
                </div>
                <CardTitle className="text-2xl mb-4">{articles[0].title}</CardTitle>
                <CardDescription className="text-lg">
                  {articles[0].excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to={`/blog/${articles[0].id}`}>
                    Read Full Article <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Articles</h2>
            <p className="text-gray-600">Expert insights to help you build a thriving coworking community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {articles.slice(1).map((article) => {
              const Icon = article.icon;
              return (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video w-full">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs">
                        <Icon className="h-3 w-3 mr-1" />
                        {article.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                    </div>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>{article.author}</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/blog/${article.id}`}>
                          Read More <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Apply These Strategies?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Transform your coworking space with our comprehensive management platform. 
            Start implementing these proven strategies today.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
            <Link to="/auth">
              Start Your Free Trial <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">WorkspaceHub</span>
          </Link>
          <p className="text-gray-600">
            &copy; 2024 WorkspaceHub. Empowering coworking communities worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;
