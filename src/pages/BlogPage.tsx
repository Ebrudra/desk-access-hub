
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, ArrowRight, TrendingUp, Users, Lightbulb, Target } from "lucide-react";
import { Link } from "react-router-dom";

const BlogPage = () => {
  const articles = [
    {
      id: 1,
      title: "The Science Behind Successful Coworking Spaces: 7 Data-Driven Strategies",
      excerpt: "Discover the key metrics and strategies that separate thriving coworking spaces from struggling ones. Learn how data analytics can transform your space utilization and member satisfaction.",
      content: `
        <h2>Understanding Your Space Through Data</h2>
        <p>Successful coworking spaces don't just rely on intuition—they leverage data to make informed decisions. Our analysis of over 500 coworking spaces reveals seven critical strategies that drive success.</p>
        
        <h3>1. Optimal Space Utilization Rates</h3>
        <p>The sweet spot for space utilization is 70-85%. Spaces operating below 70% struggle with revenue, while those above 85% face member satisfaction issues due to overcrowding.</p>
        
        <h3>2. Member Retention Through Community Building</h3>
        <p>Spaces with active community programs see 40% higher retention rates. This includes regular networking events, skill-sharing sessions, and collaborative projects.</p>
        
        <h3>3. Flexible Pricing Models</h3>
        <p>Successful spaces offer 3-5 different membership tiers, with day passes contributing 15-20% of total revenue. Dynamic pricing based on demand can increase revenue by up to 25%.</p>
        
        <h3>4. Technology Integration</h3>
        <p>Spaces using integrated management platforms see 30% reduction in administrative overhead and 50% faster response times to member requests.</p>
        
        <h3>5. Strategic Location and Amenities</h3>
        <p>Proximity to public transport (within 5 minutes) increases membership applications by 60%. High-speed internet and coffee quality are the top-rated amenities.</p>
        
        <h3>6. Member Feedback Loop</h3>
        <p>Implementing monthly feedback surveys and acting on results leads to 35% improvement in member satisfaction scores.</p>
        
        <h3>7. Financial Health Monitoring</h3>
        <p>Successful spaces track daily revenue, monthly recurring revenue (MRR), and customer acquisition cost (CAC). Aim for CAC payback period of less than 3 months.</p>
        
        <h2>Implementation Strategy</h2>
        <p>Start by implementing analytics tools to track these metrics. Set monthly targets and review performance regularly. Remember, data without action is just numbers—use insights to drive continuous improvement.</p>
      `,
      author: "Dr. Sarah Mitchell",
      date: "2024-06-10",
      readTime: "8 min read",
      category: "Analytics",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Building Thriving Communities: The Psychology of Coworking Success",
      excerpt: "Explore the psychological principles that make coworking communities flourish. Learn how to design spaces and programs that foster collaboration, creativity, and lasting professional relationships.",
      content: `
        <h2>The Psychology of Belonging</h2>
        <p>Humans have an innate need to belong to a community. Successful coworking spaces tap into this fundamental psychological drive to create environments where members feel valued, connected, and inspired.</p>
        
        <h3>Creating Psychological Safety</h3>
        <p>Members need to feel safe to take risks, share ideas, and be vulnerable. This is achieved through clear community guidelines, consistent enforcement, and leadership that models inclusive behavior.</p>
        
        <h3>The Power of Serendipitous Encounters</h3>
        <p>Design your space to encourage chance meetings. Strategic placement of coffee stations, communal tables, and casual seating areas increases spontaneous interactions by 300%.</p>
        
        <h3>Ritual and Routine</h3>
        <p>Regular events create rhythm and anticipation. Weekly networking lunches, monthly speaker series, and quarterly celebrations give members something to look forward to and plan around.</p>
        
        <h3>Diversity and Inclusion</h3>
        <p>Diverse communities are more innovative and creative. Actively recruit members from different industries, backgrounds, and experience levels to create a rich ecosystem of collaboration.</p>
        
        <h3>Shared Purpose and Values</h3>
        <p>Clearly articulated mission and values help attract like-minded individuals. Members who align with your space's purpose are 60% more likely to become long-term members.</p>
        
        <h2>Practical Implementation</h2>
        <p>Start with a member survey to understand their motivations and goals. Create programming that addresses these needs while fostering connections between members with complementary skills or interests.</p>
      `,
      author: "James Rodriguez",
      date: "2024-06-08",
      readTime: "6 min read",
      category: "Community",
      icon: Users,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Innovation Through Design: How Space Layout Drives Productivity and Collaboration",
      excerpt: "Discover how thoughtful space design can boost member productivity by up to 40%. Learn the principles of activity-based working and how to create zones that support different types of work.",
      content: `
        <h2>The Science of Space Design</h2>
        <p>Your physical environment directly impacts cognitive function, creativity, and collaboration. Research shows that well-designed coworking spaces can increase productivity by 20-40% compared to traditional offices.</p>
        
        <h3>Activity-Based Working Zones</h3>
        <p>Different tasks require different environments. Create distinct zones for focused work, collaboration, phone calls, and relaxation. Members should be able to choose the environment that best suits their current task.</p>
        
        <h3>Biophilic Design Elements</h3>
        <p>Incorporating natural elements—plants, natural light, water features—reduces stress by 15% and increases creativity by 25%. Aim for views of nature from 80% of workstations.</p>
        
        <h3>Acoustic Design</h3>
        <p>Noise is the #1 complaint in coworking spaces. Use a combination of sound-absorbing materials, white noise, and layout design to create acoustic comfort. Target background noise levels of 45-50 dB for focus areas.</p>
        
        <h3>Lighting Strategy</h3>
        <p>Natural light is crucial for circadian rhythm regulation and mood. Supplement with adjustable artificial lighting that mimics natural light patterns throughout the day.</p>
        
        <h3>Technology Infrastructure</h3>
        <p>Seamless technology integration is expected. Provide abundant power outlets, high-speed WiFi (minimum 50 Mbps per user), and easy-to-use AV equipment in meeting rooms.</p>
        
        <h3>Flexibility and Adaptability</h3>
        <p>Use modular furniture and moveable partitions to allow space reconfiguration. 70% of successful spaces reorganize their layout at least twice per year based on usage patterns.</p>
        
        <h2>Measuring Success</h2>
        <p>Track space utilization rates, member satisfaction scores, and productivity metrics to continuously optimize your design. Use heat mapping tools to understand how members actually use your space.</p>
      `,
      author: "Maria Chen",
      date: "2024-06-05",
      readTime: "7 min read",
      category: "Design",
      icon: Lightbulb,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Revenue Optimization Strategies: Maximizing Profitability in Competitive Markets",
      excerpt: "Master the art of pricing, upselling, and revenue diversification. Learn proven strategies to increase your average revenue per member while maintaining high satisfaction rates.",
      content: `
        <h2>Understanding Your Revenue Streams</h2>
        <p>Successful coworking spaces don't rely solely on membership fees. The most profitable spaces have 4-6 different revenue streams, with memberships typically accounting for 60-70% of total revenue.</p>
        
        <h3>Dynamic Pricing Strategies</h3>
        <p>Implement demand-based pricing for meeting rooms and hot desks. Peak hours (9 AM - 5 PM) can command 30-50% higher rates. Use surge pricing during high-demand periods to maximize revenue.</p>
        
        <h3>Upselling and Cross-selling</h3>
        <p>Train your team to identify upselling opportunities. Members who start with basic memberships upgrade to premium plans 40% of the time when presented with clear value propositions.</p>
        
        <h3>Corporate Partnerships</h3>
        <p>Enterprise clients can provide 25-40% of revenue despite being only 10-15% of members. Offer corporate packages with dedicated spaces, team building events, and custom branding opportunities.</p>
        
        <h3>Event Revenue</h3>
        <p>Evening and weekend events can generate significant additional revenue. Successful spaces earn 15-25% of total revenue from events, workshops, and space rentals.</p>
        
        <h3>Ancillary Services</h3>
        <p>Offer services your members need: mail handling, printing, equipment rental, and professional services. These high-margin offerings can add 10-20% to your bottom line.</p>
        
        <h3>Membership Retention Programs</h3>
        <p>Increasing retention by just 5% can increase profits by 25-95%. Implement loyalty programs, referral bonuses, and early renewal discounts to reduce churn.</p>
        
        <h2>Financial KPIs to Track</h2>
        <p>Monitor monthly recurring revenue (MRR), average revenue per user (ARPU), customer lifetime value (CLV), and churn rate. Set targets and review performance monthly to identify optimization opportunities.</p>
      `,
      author: "David Park",
      date: "2024-06-03",
      readTime: "9 min read",
      category: "Business",
      icon: Target,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
    }
  ];

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
            Coworking Success Stories & Insights
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
                    <articles[0].icon className="h-3 w-3 mr-1" />
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
            {articles.slice(1).map((article) => (
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
                      <article.icon className="h-3 w-3 mr-1" />
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
            ))}
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
            © 2024 WorkspaceHub. Empowering coworking communities worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;
