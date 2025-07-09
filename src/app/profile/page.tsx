'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../../supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Save, X, User, Mail, Calendar, MapPin, BookOpen } from 'lucide-react'
import DashboardNavbar from '@/components/dashboard-navbar'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editData, setEditData] = useState<{
    display_name: string;
    bio: string;
    interests: string;
  }>({
    display_name: '',
    bio: '',
    interests: ''
  })

  type EditDataType = typeof editData
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()
          setUserProfile(profile)
          setEditData({
            display_name: profile?.display_name || '',
            bio: profile?.bio || '',
            interests: profile?.interests || ''
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [supabase, toast])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update(editData)
        .eq('id', user.id)

      if (error) {
        throw error
      }

      setUserProfile((prev: any) => prev ? { ...prev, ...editData } : null)
      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      display_name: userProfile?.display_name || '',
      bio: userProfile?.bio || '',
      interests: userProfile?.interests || ''
    })
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">Loading profile...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12 text-red-500">User not found</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/70 border border-white/20 shadow-2xl">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userProfile?.avatar_url || user.user_metadata?.avatar_url} />
                      <AvatarFallback className="text-2xl">
                        {userProfile?.display_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">
                    {userProfile?.display_name || 'User'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {user.email}
                  </p>
                  <div className="flex justify-center mt-4">
                    <Badge variant="outline" className="text-xs">
                      Member since {new Date(userProfile?.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="md:col-span-2">
              <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/70 border border-white/20 shadow-2xl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Profile Information</CardTitle>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Display Name */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Display Name
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.display_name}
                        onChange={(e) => setEditData((prev: EditDataType) => ({ ...prev, display_name: e.target.value }))}
                        placeholder="Enter your display name"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {userProfile?.display_name || 'Not set'}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Bio
                    </Label>
                    {isEditing ? (
                      <Textarea
                        value={editData.bio}
                        onChange={(e) => setEditData((prev: EditDataType) => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {userProfile?.bio || 'No bio added yet'}
                      </p>
                    )}
                  </div>

                  {/* Interests */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Interests
                    </Label>
                    {isEditing ? (
                      <Textarea
                        value={editData.interests}
                        onChange={(e) => setEditData((prev: EditDataType) => ({ ...prev, interests: e.target.value }))}
                        placeholder="What are you interested in?"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {userProfile?.interests || 'No interests added yet'}
                      </p>
                    )}
                  </div>

                  {/* Other Profile Fields (Read-only) */}
                  {userProfile?.date_of_birth && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date of Birth
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(userProfile.date_of_birth).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {userProfile?.gender && (
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <p className="text-sm text-muted-foreground capitalize">
                        {userProfile.gender.replace('-', ' ')}
                      </p>
                    </div>
                  )}

                  {userProfile?.reason && (
                    <div className="space-y-2">
                      <Label>Reason for Joining</Label>
                      <p className="text-sm text-muted-foreground capitalize">
                        {userProfile.reason.replace('-', ' ')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 