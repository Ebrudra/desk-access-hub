
import { supabase } from "@/integrations/supabase/client";

export const seedDemoData = async () => {
  try {
    // Create a demo space
    const { data: space, error: spaceError } = await supabase
      .from("spaces")
      .insert({
        name: "Tech Hub Downtown",
        description: "A modern coworking space in the heart of the city",
        address: "123 Innovation Street",
        city: "San Francisco",
        country: "USA",
        postal_code: "94105",
        phone: "+1 (555) 123-4567",
        email: "hello@techhub.com",
        amenities: ["WiFi", "Coffee", "Meeting Rooms", "Printing", "Phone Booths"],
        operating_hours: {
          monday: { start: "08:00", end: "20:00" },
          tuesday: { start: "08:00", end: "20:00" },
          wednesday: { start: "08:00", end: "20:00" },
          thursday: { start: "08:00", end: "20:00" },
          friday: { start: "08:00", end: "20:00" },
          saturday: { start: "09:00", end: "18:00" },
          sunday: { start: "10:00", end: "16:00" }
        }
      })
      .select()
      .single();

    if (spaceError) throw spaceError;

    // Create demo resources
    const resources = [
      {
        space_id: space.id,
        name: "Hot Desk Area",
        type: "hot_desk",
        description: "Flexible workspace with high-speed internet",
        capacity: 20,
        hourly_rate: 15.00,
        daily_rate: 50.00,
        amenities: ["WiFi", "Power Outlets", "Natural Light"]
      },
      {
        space_id: space.id,
        name: "Conference Room A",
        type: "meeting_room",
        description: "8-person meeting room with projector",
        capacity: 8,
        hourly_rate: 75.00,
        amenities: ["Projector", "Whiteboard", "Video Conferencing"]
      },
      {
        space_id: space.id,
        name: "Private Office 1",
        type: "private_office",
        description: "Private office for 1-2 people",
        capacity: 2,
        daily_rate: 200.00,
        amenities: ["Desk", "Chair", "Storage", "Window View"]
      },
      {
        space_id: space.id,
        name: "Phone Booth 1",
        type: "phone_booth",
        description: "Quiet space for calls",
        capacity: 1,
        hourly_rate: 10.00,
        amenities: ["Soundproof", "Comfortable Seating"]
      }
    ];

    const { error: resourcesError } = await supabase
      .from("resources")
      .insert(resources);

    if (resourcesError) throw resourcesError;

    // Create demo events
    const events = [
      {
        space_id: space.id,
        title: "Startup Networking Night",
        description: "Connect with fellow entrepreneurs and startup founders",
        event_type: "networking",
        start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // +3 hours
        capacity: 50,
        price: 25.00,
        is_public: true,
        registration_required: true
      },
      {
        space_id: space.id,
        title: "React Workshop",
        description: "Learn the fundamentals of React development",
        event_type: "workshop",
        start_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // In 2 weeks
        end_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // +4 hours
        capacity: 25,
        price: 75.00,
        is_public: true,
        registration_required: true
      }
    ];

    const { error: eventsError } = await supabase
      .from("events")
      .insert(events);

    if (eventsError) throw eventsError;

    console.log("Demo data seeded successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error seeding demo data:", error);
    return { success: false, error };
  }
};
