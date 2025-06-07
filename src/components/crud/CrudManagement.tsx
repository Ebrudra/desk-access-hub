
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingsList } from "./BookingsList";
import { SpaceForm } from "./SpaceForm";
import { MembersList } from "./MembersList";
import { ResourcesList } from "./ResourcesList";
import { EventsList } from "./EventsList";
import { Calendar, Building2, Users, MapPin, Settings } from "lucide-react";

export const CrudManagement = () => {
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Management Dashboard
        </h1>
        <p className="text-gray-600">
          Manage all aspects of your coworking space
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="spaces" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Spaces
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <BookingsList />
        </TabsContent>

        <TabsContent value="spaces">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spaces Management</CardTitle>
              </CardHeader>
              <CardContent>
                <SpaceForm />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members">
          <MembersList />
        </TabsContent>

        <TabsContent value="resources">
          <ResourcesList />
        </TabsContent>

        <TabsContent value="events">
          <EventsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
