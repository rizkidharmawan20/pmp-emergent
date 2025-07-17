import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  User, 
  Instagram, 
  Video,
  Link,
  Bell,
  Shield,
  LogOut,
  CheckCircle,
  XCircle,
  Settings,
  Camera,
  Mail,
  Phone
} from 'lucide-react';

const Profile = () => {
  const [searchParams] = useSearchParams();
  const { user, logout, updateUser, connectSocialAccount } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUser(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectInstagram = async () => {
    setLoading(true);
    try {
      // Mock Instagram connection
      await connectSocialAccount('instagram');
    } catch (error) {
      console.error('Error connecting Instagram:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectTikTok = async () => {
    setLoading(true);
    try {
      // Mock TikTok connection
      await connectSocialAccount('tiktok');
    } catch (error) {
      console.error('Error connecting TikTok:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Profile Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-xl">
                    {user?.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="avatar">Avatar URL</Label>
                        <Input
                          id="avatar"
                          placeholder="Enter image URL"
                          value={editForm.avatar}
                          onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                        />
                      </div>
                      <Button
                        onClick={() => {
                          updateUser({ avatar: editForm.avatar });
                        }}
                        className="w-full"
                      >
                        Update Avatar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                  <Badge 
                    variant={user?.role === 'creator' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {user?.role}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    {user?.instagramConnected ? (
                      <span className="text-sm text-green-600 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 flex items-center">
                        <XCircle className="h-3 w-3 mr-1" />
                        Not connected
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Video className="h-4 w-4 text-black" />
                    {user?.tiktokConnected ? (
                      <span className="text-sm text-green-600 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 flex items-center">
                        <XCircle className="h-3 w-3 mr-1" />
                        Not connected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="flex space-x-4">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{user?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Account Type</p>
                        <p className="font-medium capitalize">{user?.role}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="accounts" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Instagram */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-pink-100 rounded-full p-2">
                        <Instagram className="h-6 w-6 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Instagram</h3>
                        <p className="text-sm text-gray-600">
                          {user?.instagramConnected 
                            ? 'Connected - Post videos and track metrics'
                            : 'Connect your Instagram account to participate in challenges'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user?.instagramConnected ? (
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      ) : (
                        <Button
                          onClick={handleConnectInstagram}
                          disabled={loading}
                          size="sm"
                        >
                          {loading ? 'Connecting...' : 'Connect'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* TikTok */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 rounded-full p-2">
                        <Video className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-medium">TikTok</h3>
                        <p className="text-sm text-gray-600">
                          {user?.tiktokConnected 
                            ? 'Connected - Post videos and track metrics'
                            : 'Connect your TikTok account to participate in challenges'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user?.tiktokConnected ? (
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      ) : (
                        <Button
                          onClick={handleConnectTikTok}
                          disabled={loading}
                          size="sm"
                        >
                          {loading ? 'Connecting...' : 'Connect'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {(!user?.instagramConnected && !user?.tiktokConnected) && (
                <Alert className="border-orange-200 bg-orange-50">
                  <Link className="h-4 w-4" />
                  <AlertDescription>
                    Connect at least one social media account to participate in challenges and earn rewards.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Challenge Updates</p>
                      <p className="text-sm text-gray-600">Get notified about new challenges and deadlines</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Earnings Updates</p>
                      <p className="text-sm text-gray-600">Get notified about view counts and earnings</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Payout Notifications</p>
                      <p className="text-sm text-gray-600">Get notified about payout processing</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Marketing Updates</p>
                      <p className="text-sm text-gray-600">Get notified about new features and promotions</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-gray-600">Update your password regularly</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Login History</p>
                        <p className="text-sm text-gray-600">View recent login activity</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-gray-600">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sign Out</p>
                      <p className="text-sm text-gray-600">
                        Sign out of your account on this device
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;