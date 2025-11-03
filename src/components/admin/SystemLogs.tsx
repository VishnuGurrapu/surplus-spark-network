import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

const SystemLogs = () => {
  const logs = [
    { id: 1, type: "success", message: "Donation D105 successfully matched with NGO N002", time: "2 mins ago" },
    { id: 2, type: "info", message: "New user registration: john.doe@example.com", time: "15 mins ago" },
    { id: 3, type: "warning", message: "High demand detected in District 5", time: "1 hour ago" },
    { id: 4, type: "error", message: "Failed delivery attempt for D089 - recipient unavailable", time: "2 hours ago" },
    { id: 5, type: "success", message: "NGO verification completed for Hope Foundation", time: "3 hours ago" },
    { id: 6, type: "info", message: "System backup completed successfully", time: "5 hours ago" },
    { id: 7, type: "warning", message: "Server load at 75% capacity", time: "6 hours ago" },
    { id: 8, type: "success", message: "Delivery D098 marked as completed", time: "8 hours ago" }
  ];

  const getLogIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="w-5 h-5 text-success" />;
      case "error": return <XCircle className="w-5 h-5 text-destructive" />;
      case "warning": return <AlertCircle className="w-5 h-5 text-warning" />;
      default: return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getLogBadge = (type: string) => {
    const variants: Record<string, string> = {
      success: "bg-success/10 text-success",
      error: "bg-destructive/10 text-destructive",
      warning: "bg-warning/10 text-warning",
      info: "bg-primary/10 text-primary"
    };
    return variants[type] || variants.info;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">System Logs</h2>
        <p className="text-muted-foreground">Monitor activity and system events</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-sm text-muted-foreground">Success</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Info className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">567</p>
            <p className="text-sm text-muted-foreground">Info</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-warning" />
            <p className="text-2xl font-bold">45</p>
            <p className="text-sm text-muted-foreground">Warnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <XCircle className="w-8 h-8 mx-auto mb-2 text-destructive" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Errors</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system events and logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors">
                <div className="mt-1">
                  {getLogIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getLogBadge(log.type)}>
                      {log.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                  <p className="text-sm">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div>
                <p className="font-medium text-destructive">Failed API Calls</p>
                <p className="text-sm text-muted-foreground">Last 24 hours</p>
              </div>
              <span className="text-2xl font-bold text-destructive">3</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-warning/5 border border-warning/20 rounded-lg">
              <div>
                <p className="font-medium text-warning">Flagged Transactions</p>
                <p className="text-sm text-muted-foreground">Pending review</p>
              </div>
              <span className="text-2xl font-bold text-warning">7</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemLogs;
