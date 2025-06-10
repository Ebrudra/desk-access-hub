
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Users, MapPin } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const NewBooking = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Booking
          </h1>
          <p className="text-gray-600">
            Book a space for your next meeting or event
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Booking Details
                </CardTitle>
                <CardDescription>
                  Fill in the details for your booking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Booking form will be implemented in Part 2</p>
                  <Button onClick={() => navigate("/?tab=crud")}>
                    Go to Management Panel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Quick Book
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Meeting Room (4 people)
                  </Button>
                  <Button className="w-full" variant="outline">
                    <MapPin className="mr-2 h-4 w-4" />
                    Conference Hall (20 people)
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Hot Desk (1 person)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBooking;
