
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Shield, 
  Mail, 
  Bell, 
  CreditCard, 
  Database, 
  Globe,
  Clock,
  Users,
  Key
} from "lucide-react";

export const SystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "CoWork Manager",
    siteDescription: "Modern coworking space management",
    allowRegistration: true,
    requireEmailVerification: true,
    
    // Security Settings
    sessionTimeout: 24,
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowGoogleAuth: true,
    
    // Booking Settings
    maxBookingDuration: 8,
    advanceBookingDays: 30,
    cancellationWindow: 2,
    autoApproveBookings: false,
    
    // Notification Settings
    emailNotifications: true,
    bookingReminders: true,
    maintenanceAlerts: true,
    marketingEmails: false,
    
    // Payment Settings
    currency: "USD",
    taxRate: 8.5,
    lateFeeEnabled: true,
    gracePeriodDays: 3
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (category: string) => {
    toast({
      title: "Settings Saved",
      description: `${category} settings have been updated successfully.`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>System Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="booking">Booking</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => handleSettingChange('siteName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Input
                      id="siteDescription"
                      value={settings.siteDescription}
                      onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Allow New Registrations</Label>
                      <p className="text-sm text-gray-600">Enable public user registration</p>
                    </div>
                    <Switch
                      checked={settings.allowRegistration}
                      onCheckedChange={(checked) => handleSettingChange('allowRegistration', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Email Verification Required</Label>
                      <p className="text-sm text-gray-600">Require email verification for new users</p>
                    </div>
                    <Switch
                      checked={settings.requireEmailVerification}
                      onCheckedChange={(checked) => handleSettingChange('requireEmailVerification', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSave('General')}>
                <Globe className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Require Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Mandatory 2FA for all users</p>
                    </div>
                    <Switch
                      checked={settings.requireTwoFactor}
                      onCheckedChange={(checked) => handleSettingChange('requireTwoFactor', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Google Authentication</Label>
                      <p className="text-sm text-gray-600">Allow login with Google accounts</p>
                    </div>
                    <Switch
                      checked={settings.allowGoogleAuth}
                      onCheckedChange={(checked) => handleSettingChange('allowGoogleAuth', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSave('Security')}>
                <Shield className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </TabsContent>

            <TabsContent value="booking" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="maxBookingDuration">Max Booking Duration (hours)</Label>
                    <Input
                      id="maxBookingDuration"
                      type="number"
                      value={settings.maxBookingDuration}
                      onChange={(e) => handleSettingChange('maxBookingDuration', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="advanceBookingDays">Advance Booking Days</Label>
                    <Input
                      id="advanceBookingDays"
                      type="number"
                      value={settings.advanceBookingDays}
                      onChange={(e) => handleSettingChange('advanceBookingDays', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cancellationWindow">Cancellation Window (hours)</Label>
                    <Input
                      id="cancellationWindow"
                      type="number"
                      value={settings.cancellationWindow}
                      onChange={(e) => handleSettingChange('cancellationWindow', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Auto-Approve Bookings</Label>
                      <p className="text-sm text-gray-600">Automatically approve booking requests</p>
                    </div>
                    <Switch
                      checked={settings.autoApproveBookings}
                      onCheckedChange={(checked) => handleSettingChange('autoApproveBookings', checked)}
                    />
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Booking Rules Summary</h4>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p>• Max duration: {settings.maxBookingDuration} hours</p>
                      <p>• Book up to {settings.advanceBookingDays} days ahead</p>
                      <p>• Cancel {settings.cancellationWindow}h before start</p>
                      <p>• Auto-approval: {settings.autoApproveBookings ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSave('Booking')}>
                <Clock className="h-4 w-4 mr-2" />
                Save Booking Settings
              </Button>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Email Notifications</h4>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-600">Enable email notifications</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Booking Reminders</Label>
                      <p className="text-sm text-gray-600">Send booking reminder emails</p>
                    </div>
                    <Switch
                      checked={settings.bookingReminders}
                      onCheckedChange={(checked) => handleSettingChange('bookingReminders', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">System Alerts</h4>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Maintenance Alerts</Label>
                      <p className="text-sm text-gray-600">Notify about system maintenance</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceAlerts}
                      onCheckedChange={(checked) => handleSettingChange('maintenanceAlerts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-gray-600">Send promotional content</p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSave('Notifications')}>
                <Bell className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currency">Default Currency</Label>
                    <Input
                      id="currency"
                      value={settings.currency}
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.1"
                      value={settings.taxRate}
                      onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gracePeriodDays">Grace Period (days)</Label>
                    <Input
                      id="gracePeriodDays"
                      type="number"
                      value={settings.gracePeriodDays}
                      onChange={(e) => handleSettingChange('gracePeriodDays', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Late Fee Enabled</Label>
                      <p className="text-sm text-gray-600">Charge late fees for overdue payments</p>
                    </div>
                    <Switch
                      checked={settings.lateFeeEnabled}
                      onCheckedChange={(checked) => handleSettingChange('lateFeeEnabled', checked)}
                    />
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Payment Summary</h4>
                    <div className="space-y-1 text-sm text-green-700">
                      <p>• Currency: {settings.currency}</p>
                      <p>• Tax rate: {settings.taxRate}%</p>
                      <p>• Grace period: {settings.gracePeriodDays} days</p>
                      <p>• Late fees: {settings.lateFeeEnabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => handleSave('Payment')}>
                <CreditCard className="h-4 w-4 mr-2" />
                Save Payment Settings
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Database</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <p className="text-xs text-gray-600">Last backup: 2 hours ago</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Email Service</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <p className="text-xs text-gray-600">Queue: 0 pending</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Payment Gateway</span>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <p className="text-xs text-gray-600">Response time: 180ms</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
