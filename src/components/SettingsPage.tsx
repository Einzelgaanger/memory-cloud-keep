
import React, { useState } from 'react';
import { Settings, Lock, Eye, EyeOff, Save, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate current password
    if (currentPassword !== 'Insideout.co.ke(1907)') {
      toast({
        title: "Incorrect current password",
        description: "Please enter your current password correctly.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate new password
    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new password and confirmation match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate password update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real application, you would update the password in your backend/database
    toast({
      title: "Password updated",
      description: "Your password has been successfully changed.",
    });

    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          Settings
        </h2>
        <p className="text-gray-600 mt-2">Manage your diary settings and preferences</p>
      </div>

      {/* Security Settings */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            Security
          </CardTitle>
          <CardDescription>
            Keep your diary secure by managing your access password
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-600" />
                Change Password
              </h3>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className="pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>

            <Separator />

            {/* Data & Privacy Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Data & Privacy</h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Your data is secure</h4>
                    <p className="text-blue-700 text-sm">
                      All your journal entries and events are stored locally. When you connect Supabase, 
                      your data will be encrypted and securely stored in the cloud.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Private by design</h4>
                    <p className="text-blue-700 text-sm">
                      Your diary is protected by your personal password and is completely private to you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supabase Integration Info */}
      <Card className="border border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Ready for Cloud Storage</CardTitle>
          <CardDescription className="text-green-700">
            Connect your Supabase database to store your diary entries and files in the cloud securely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 text-sm">
            Once connected, you'll be able to:
          </p>
          <ul className="list-disc list-inside text-green-700 text-sm mt-2 space-y-1">
            <li>Store journal entries and events in the cloud</li>
            <li>Upload and manage file attachments</li>
            <li>Access your diary from multiple devices</li>
            <li>Automatic backups and sync</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
