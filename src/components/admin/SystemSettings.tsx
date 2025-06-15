
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, Shield, BarChart3, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SystemSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSettings, setEditingSettings] = useState<Record<string, any>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .order("category", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: auditLogs } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: performanceMetrics } = useQuery({
    queryKey: ["performance-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("performance_metrics")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: automatedTasks } = useQuery({
    queryKey: ["automated-tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automated_tasks")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: any }) => {
      const { error } = await supabase
        .from("system_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Setting Updated",
        description: "System setting has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      setEditingSettings({});
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("automated_tasks")
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Task Updated",
        description: "Automated task status has been updated",
      });
      queryClient.invalidateQueries({ queryKey: ["automated-tasks"] });
    },
  });

  const runTaskMutation = useMutation({
    mutationFn: async (taskType: string) => {
      const { data, error } = await supabase.functions.invoke('automated-tasks', {
        body: { taskType, parameters: {} }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Task Executed",
        description: `Task completed successfully: ${JSON.stringify(data.result)}`,
      });
      queryClient.invalidateQueries({ queryKey: ["automated-tasks"] });
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'error': return 'bg-orange-100 text-orange-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const groupedSettings = settings?.reduce((acc, setting) => {
    const category = setting.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(setting);
    return acc;
  }, {} as Record<string, any[]>) || {};

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading system settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-6 w-6 text-blue-600" />
        <h1 className="text-3xl font-bold">System Settings</h1>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <Clock className="h-4 w-4 mr-2" />
            Automated Tasks
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Shield className="h-4 w-4 mr-2" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="metrics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <div className="grid gap-6">
            {Object.entries(groupedSettings).map(([category, categorySettings]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize">{category} Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categorySettings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{setting.key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</h3>
                          {setting.is_public && <Badge variant="secondary">Public</Badge>}
                        </div>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                        
                        {editingSettings[setting.id] ? (
                          <div className="mt-2 flex items-center space-x-2">
                            <Input
                              type={typeof setting.value === 'boolean' ? 'checkbox' : 'text'}
                              value={editingSettings[setting.id]}
                              onChange={(e) => setEditingSettings({
                                ...editingSettings,
                                [setting.id]: e.target.value
                              })}
                              className="max-w-xs"
                            />
                            <Button 
                              size="sm" 
                              onClick={() => updateSettingMutation.mutate({
                                id: setting.id,
                                value: editingSettings[setting.id]
                              })}
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingSettings({})}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center space-x-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {String(setting.value)}
                            </code>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingSettings({
                                [setting.id]: String(setting.value)
                              })}
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Automated Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automatedTasks?.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium">{task.name}</h3>
                        <Badge variant={task.is_active ? "default" : "secondary"}>
                          {task.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        Schedule: <code>{task.schedule_expression}</code>
                      </p>
                      <div className="text-xs text-gray-400 space-x-4">
                        <span>Runs: {task.run_count || 0}</span>
                        <span>Success: {task.success_count || 0}</span>
                        <span>Failures: {task.failure_count || 0}</span>
                        {task.last_run_at && (
                          <span>Last: {new Date(task.last_run_at).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={task.is_active}
                        onCheckedChange={(checked) => 
                          toggleTaskMutation.mutate({ id: task.id, is_active: checked })
                        }
                      />
                      <Button
                        size="sm"
                        onClick={() => runTaskMutation.mutate(task.type)}
                        disabled={runTaskMutation.isPending}
                      >
                        Run Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditLogs?.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{log.action}</span>
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {log.resource_type} {log.resource_id && `(${log.resource_id})`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(log.created_at).toLocaleString()} 
                        {log.ip_address && ` - ${log.ip_address}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {['active_bookings', 'total_active_members', 'today_bookings'].map((metricName) => {
                  const latestMetric = performanceMetrics?.find(m => m.metric_name === metricName);
                  return (
                    <div key={metricName} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium capitalize mb-2">
                        {metricName.replace(/_/g, ' ')}
                      </h3>
                      <p className="text-2xl font-bold">{latestMetric?.metric_value || 0}</p>
                      <p className="text-xs text-gray-500">
                        {latestMetric?.recorded_at ? 
                          new Date(latestMetric.recorded_at).toLocaleString() : 
                          'No data'
                        }
                      </p>
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Recent Metrics</h4>
                {performanceMetrics?.slice(0, 20).map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-medium">{metric.metric_name}</span>
                      <span className="ml-2 text-gray-600">({metric.metric_type})</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono">{metric.metric_value}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(metric.recorded_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
