import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, MapPin, Lock, Bell, Plus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { api, type ApiUserAddress } from "@/lib/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.addresses?.[0]?.street || ""
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: profileData.name,
        phone: profileData.phone,
      });
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(message);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.auth.changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to change password. Please verify your current password.";
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addresses = [...(user?.addresses || []), { ...newAddress, isDefault: (user?.addresses?.length || 0) === 0 }];
      await updateProfile({ addresses });
      toast.success("Address added successfully!");
      setShowAddressForm(false);
      setNewAddress({ street: "", city: "", state: "", pincode: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add address";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            My{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Account
            </span>
          </h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Package className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="addresses">
                <MapPin className="h-4 w-4 mr-2" />
                Addresses
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          disabled
                          className="bg-muted cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="bg-gradient-primary">
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-bold mb-2">Manage Your Orders</h2>
                  <p className="text-muted-foreground mb-6">
                    View tracking, order history, and downloadable invoices.
                  </p>
                  <Button className="bg-gradient-primary" asChild>
                    <Link to="/profile/orders">Go to Order History</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Saved Addresses</h2>
                    <Button onClick={() => setShowAddressForm(!showAddressForm)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  </div>

                  {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/20">
                      <div className="space-y-2">
                        <Label>Street Address</Label>
                        <Input
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>City</Label>
                          <Input
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>State</Label>
                          <Input
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>Pincode</Label>
                          <Input
                            value={newAddress.pincode}
                            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit">Save Address</Button>
                        <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-4">
                    {user?.addresses && user.addresses.length > 0 ? (
                      user.addresses.map((addr: ApiUserAddress, idx: number) => (
                        <div key={idx} className="p-4 border rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{addr.street}</p>
                            <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                          </div>
                          {addr.isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Default</span>}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-6">No saved addresses yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                    <h3 className="font-semibold text-lg">Change Password</h3>
                    <div className="space-y-2">
                      <Label htmlFor="currentPass">Current Password</Label>
                      <Input
                        id="currentPass"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPass">New Password</Label>
                      <Input
                        id="newPass"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPass">Confirm New Password</Label>
                      <Input
                        id="confirmPass"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isChangingPassword} className="bg-gradient-primary">
                      {isChangingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="border-0 shadow-premium bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Order Updates</p>
                        <p className="text-sm text-muted-foreground">Receive real-time email & SMS tracking updates</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toast.success("Order updates enabled")}>Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Promotional Offers</p>
                        <p className="text-sm text-muted-foreground">Receive discounts and seasonal maintenance reminders</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toast.success("Promotions preferences updated")}>Enabled</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
