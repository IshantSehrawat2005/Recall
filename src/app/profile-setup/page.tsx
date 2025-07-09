'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateOfBirthPicker } from '@/components/ui/date-of-birth-picker'
import { createClient } from '../../../supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export default function ProfileSetup() {
  const [step, setStep] = useState<number>(1)
  const [formData, setFormData] = useState<{
    displayName: string;
    bio: string;
    dateOfBirth: Date | undefined;
    gender: string;
    reason: string;
    interests: string;
  }>({
    displayName: '',
    bio: '',
    dateOfBirth: undefined,
    gender: '',
    reason: '',
    interests: ''
  })
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (field: keyof typeof formData, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please sign in again to complete your profile.",
          variant: "destructive",
        })
        router.push('/sign-in')
        return
      }

      const { error } = await supabase
        .from('users')
        .update({
          display_name: formData.displayName,
          bio: formData.bio,
          date_of_birth: formData.dateOfBirth?.toISOString().split('T')[0],
          gender: formData.gender,
          reason: formData.reason,
          interests: formData.interests,
          profile_completed: true
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating profile:', error)
        toast({
          title: "Profile Update Failed",
          description: "There was an error saving your profile. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Profile Completed!",
          description: "Welcome to Recall! Your profile has been set up successfully.",
        })
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="How should we call you?"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us a bit about yourself..."
                rows={3}
                required
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <DateOfBirthPicker
              value={formData.dateOfBirth}
              onChange={(date) => handleInputChange('dateOfBirth', date)}
              placeholder="Select your date of birth"
              required
            />
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">What brought you here?</Label>
              <Select value={formData.reason} onValueChange={(value) => handleInputChange('reason', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select the main reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="learning">Learning & Education</SelectItem>
                  <SelectItem value="productivity">Productivity & Organization</SelectItem>
                  <SelectItem value="creativity">Creativity & Writing</SelectItem>
                  <SelectItem value="research">Research & Knowledge</SelectItem>
                  <SelectItem value="personal">Personal Development</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interests">Interests & Hobbies</Label>
              <Textarea
                id="interests"
                value={formData.interests}
                onChange={(e) => handleInputChange('interests', e.target.value)}
                placeholder="What are you passionate about? (e.g., reading, gaming, sports, music, technology, art...)"
                rows={3}
                className="resize-none"
                required
              />
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
              <p className="text-sm text-muted-foreground">
                🎉 Great! We're almost done. This information will help us personalize your experience and connect you with like-minded people.
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-2xl border border-white/20 shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2">
              Complete Your Profile
            </h1>
            <p className="text-muted-foreground">
              Step {step} of 3 - Let's get to know you better
            </p>
          </div>
          
          <div className="space-y-6">
            {renderStep()}
            {/* Only show terms and action buttons on last step */}
            {step === 3 && (
              <div className="flex flex-col w-full items-center">
                <div className="flex items-center mb-4 w-full justify-center">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="mr-2 accent-primary rounded"
                    required
                  />
                  <label htmlFor="agree" className="text-sm text-muted-foreground select-none">
                    I agree to the <a href="/terms" target="_blank" className="underline hover:text-primary">Terms and Conditions</a>
                  </label>
                </div>
                <div className="flex flex-row gap-3 w-full justify-center">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="backdrop-blur-sm bg-white/50 dark:bg-black/50 border-white/20 hover:bg-white/70 dark:hover:bg-black/70 px-6 py-2 text-base"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading || !formData.interests || !agreed}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 px-6 py-2 text-base"
                  >
                    {loading ? 'Creating Profile...' : 'Complete Profile'}
                  </Button>
                </div>
              </div>
            )}
            {/* Show Next/Back for steps 1 and 2 */}
            {(step === 1 || step === 2) && (
              <div className="flex flex-row gap-3 w-full justify-center pt-6">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="backdrop-blur-sm bg-white/50 dark:bg-black/50 border-white/20 hover:bg-white/70 dark:hover:bg-black/70 px-6 py-2 text-base"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 px-6 py-2 text-base"
                  disabled={
                    (Number(step) === 1 && (!formData.displayName || !formData.bio)) ||
                    (Number(step) === 2 && (!formData.dateOfBirth || !formData.gender || !formData.reason))
                  }
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 