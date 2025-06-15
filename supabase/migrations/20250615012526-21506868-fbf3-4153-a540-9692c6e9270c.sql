
-- Dummy data for bookings (past and future)
-- Fixed membership_tier values to match the enum

-- First, let's insert some sample spaces if they don't exist
INSERT INTO public.spaces (id, name, description, address, city, country, timezone) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Main Coworking Space', 'Our primary location with multiple meeting rooms and open workspace', '123 Innovation St', 'San Francisco', 'USA', 'America/Los_Angeles'),
  ('22222222-2222-2222-2222-222222222222', 'Downtown Branch', 'Compact space in the heart of downtown', '456 Business Ave', 'San Francisco', 'USA', 'America/Los_Angeles')
ON CONFLICT (id) DO NOTHING;

-- Insert sample resources
INSERT INTO public.resources (id, name, type, capacity, space_id, hourly_rate, daily_rate, is_available) 
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Meeting Room A', 'meeting_room', 8, '11111111-1111-1111-1111-111111111111', 25.00, 150.00, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Hot Desk 1', 'desk', 1, '11111111-1111-1111-1111-111111111111', 10.00, 50.00, true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Conference Hall', 'meeting_room', 20, '11111111-1111-1111-1111-111111111111', 50.00, 300.00, true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Private Office', 'office', 4, '22222222-2222-2222-2222-222222222222', 40.00, 240.00, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample members (fixed membership_tier values)
INSERT INTO public.members (id, member_id, membership_status, membership_tier, space_id, start_date, monthly_rate) 
VALUES 
  ('10000000-1000-1000-1000-100000000001', 'MEM001', 'active', 'premium', '11111111-1111-1111-1111-111111111111', '2024-01-01', 150.00),
  ('10000000-1000-1000-1000-100000000002', 'MEM002', 'active', 'basic', '11111111-1111-1111-1111-111111111111', '2024-02-01', 100.00),
  ('10000000-1000-1000-1000-100000000003', 'MEM003', 'active', 'enterprise', '22222222-2222-2222-2222-222222222222', '2024-03-01', 125.00)
ON CONFLICT (id) DO NOTHING;

-- Insert past bookings (last month)
INSERT INTO public.bookings (id, title, description, resource_id, member_id, start_time, end_time, status, attendees, total_amount) 
VALUES 
  ('b0000000-0000-0000-0000-000000000001', 'Team Meeting', 'Weekly team sync', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '10000000-1000-1000-1000-100000000001', '2024-05-15 09:00:00+00', '2024-05-15 11:00:00+00', 'confirmed', 6, 50.00),
  ('b0000000-0000-0000-0000-000000000002', 'Client Presentation', 'Q1 Results presentation', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '10000000-1000-1000-1000-100000000002', '2024-05-20 14:00:00+00', '2024-05-20 16:00:00+00', 'confirmed', 15, 100.00),
  ('b0000000-0000-0000-0000-000000000003', 'Focus Work', 'Deep work session', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '10000000-1000-1000-1000-100000000003', '2024-05-22 08:00:00+00', '2024-05-22 17:00:00+00', 'confirmed', 1, 90.00),
  ('b0000000-0000-0000-0000-000000000004', 'Design Workshop', 'UX/UI design session', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '10000000-1000-1000-1000-100000000001', '2024-05-25 10:00:00+00', '2024-05-25 15:00:00+00', 'confirmed', 8, 125.00),
  ('b0000000-0000-0000-0000-000000000005', 'All Hands Meeting', 'Monthly company meeting', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '10000000-1000-1000-1000-100000000002', '2024-05-30 13:00:00+00', '2024-05-30 15:00:00+00', 'confirmed', 20, 100.00);

-- Insert current/upcoming bookings (this month and next)
INSERT INTO public.bookings (id, title, description, resource_id, member_id, start_time, end_time, status, attendees, total_amount) 
VALUES 
  ('b0000000-0000-0000-0000-000000000006', 'Product Planning', 'Q3 product roadmap planning', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '10000000-1000-1000-1000-100000000001', '2024-06-12 09:00:00+00', '2024-06-12 12:00:00+00', 'confirmed', 7, 75.00),
  ('b0000000-0000-0000-0000-000000000007', 'Interview Session', 'Engineering candidate interviews', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '10000000-1000-1000-1000-100000000003', '2024-06-15 10:00:00+00', '2024-06-15 16:00:00+00', 'confirmed', 3, 240.00),
  ('b0000000-0000-0000-0000-000000000008', 'Board Meeting', 'Quarterly board meeting', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '10000000-1000-1000-1000-100000000002', '2024-06-18 14:00:00+00', '2024-06-18 18:00:00+00', 'confirmed', 12, 200.00),
  ('b0000000-0000-0000-0000-000000000009', 'Workshop Prep', 'Preparing for customer workshop', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '10000000-1000-1000-1000-100000000001', '2024-06-20 08:00:00+00', '2024-06-20 12:00:00+00', 'pending', 1, 40.00),
  ('b0000000-0000-0000-0000-000000000010', 'Team Building', 'Quarterly team building event', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '10000000-1000-1000-1000-100000000003', '2024-06-25 16:00:00+00', '2024-06-25 20:00:00+00', 'confirmed', 18, 200.00);

-- Insert future bookings (next month)
INSERT INTO public.bookings (id, title, description, resource_id, member_id, start_time, end_time, status, attendees, total_amount) 
VALUES 
  ('b0000000-0000-0000-0000-000000000011', 'Strategy Session', 'H2 strategy planning', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '10000000-1000-1000-1000-100000000002', '2024-07-05 09:00:00+00', '2024-07-05 17:00:00+00', 'pending', 8, 200.00),
  ('b0000000-0000-0000-0000-000000000012', 'Customer Demo', 'Product demonstration for key client', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '10000000-1000-1000-1000-100000000001', '2024-07-10 14:00:00+00', '2024-07-10 16:00:00+00', 'confirmed', 5, 80.00),
  ('b0000000-0000-0000-0000-000000000013', 'Training Session', 'New employee onboarding', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '10000000-1000-1000-1000-100000000003', '2024-07-15 10:00:00+00', '2024-07-15 15:00:00+00', 'confirmed', 15, 250.00),
  ('b0000000-0000-0000-0000-000000000014', 'Innovation Workshop', 'Ideation and brainstorming session', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '10000000-1000-1000-1000-100000000002', '2024-07-20 13:00:00+00', '2024-07-20 18:00:00+00', 'pending', 10, 125.00),
  ('b0000000-0000-0000-0000-000000000015', 'Investor Pitch', 'Series A funding presentation', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '10000000-1000-1000-1000-100000000001', '2024-07-25 11:00:00+00', '2024-07-25 13:00:00+00', 'confirmed', 8, 100.00);

-- Insert some events as well
INSERT INTO public.events (id, title, description, space_id, start_time, end_time, capacity, price, is_public, registration_required) 
VALUES 
  ('e0000000-0000-0000-0000-000000000001', 'Networking Happy Hour', 'Monthly networking event for coworking members', '11111111-1111-1111-1111-111111111111', '2024-06-28 18:00:00+00', '2024-06-28 21:00:00+00', 50, 0, true, true),
  ('e0000000-0000-0000-0000-000000000002', 'Startup Pitch Night', 'Local entrepreneurs pitch their ideas', '22222222-2222-2222-2222-222222222222', '2024-07-12 19:00:00+00', '2024-07-12 21:30:00+00', 30, 10, true, true),
  ('e0000000-0000-0000-0000-000000000003', 'Tech Talk: AI in Business', 'Educational session on AI implementation', '11111111-1111-1111-1111-111111111111', '2024-07-18 12:00:00+00', '2024-07-18 13:30:00+00', 25, 0, true, false);

-- Add some notifications for demo purposes
INSERT INTO public.notifications (id, user_id, type, title, message, is_read, action_url)
VALUES 
  (gen_random_uuid(), null, 'system', 'Welcome to WorkSpace Hub', 'Your coworking management system is now set up with demo data!', false, '/'),
  (gen_random_uuid(), null, 'booking', 'New Booking Created', 'A new booking has been made for Meeting Room A', false, '/bookings');

SELECT 'Dummy data inserted successfully!' AS status;
