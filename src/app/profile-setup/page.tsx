"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateOfBirthPicker } from "@/components/ui/date-of-birth-picker";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  CheckCircle,
  User,
  Calendar,
  Target,
  Heart,
  Sparkles,
} from "lucide-react";

export default function ProfileSetup() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<{
    displayName: string;
    bio: string;
    dateOfBirth: Date | undefined;
    gender: string;
    reason: string;
    interests: string;
    learningGoals: string;
    preferredTopics: string[];
    dailyReadingTime: string;
    notificationPreference: string;
  }>({
    displayName: "",
    bio: "",
    dateOfBirth: undefined,
    gender: "",
    reason: "",
    interests: "",
    learningGoals: "",
    preferredTopics: [],
    dailyReadingTime: "",
    notificationPreference: "",
  });
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | Date | undefined | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please sign in again to complete your profile.",
          variant: "destructive",
        });
        router.push("/sign-in");
        return;
      }

      const { error } = await supabase
        .from("users")
        .update({
          display_name: formData.displayName,
          bio: formData.bio,
          date_of_birth: formData.dateOfBirth?.toISOString().split("T")[0],
          gender: formData.gender,
          reason: formData.reason,
          interests: formData.interests,
          learning_goals: formData.learningGoals,
          preferred_topics: formData.preferredTopics,
          daily_reading_time: formData.dailyReadingTime,
          notification_preference: formData.notificationPreference,
          profile_completed: true,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Profile Update Failed",
          description:
            "There was an error saving your profile. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile Completed!",
          description:
            "Welcome to Recall! Your personalized learning journey begins now.",
        });
        router.push("/welcome?new=1");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const topicOptions = [
    "Technology",
    "Science",
    "Business",
    "Health",
    "Psychology",
    "Philosophy",
    "History",
    "Art",
    "Literature",
    "Politics",
    "Economics",
    "Environment",
    "Education",
    "Sports",
    "Travel",
    "Food",
    "Music",
    "Movies",
    "Gaming",
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 mx-auto mb-3 text-blue-600" />
              <h2 className="text-xl font-semibold mb-2">
                Tell us about yourself
              </h2>
              <p className="text-sm text-muted-foreground">
                Let's start with the basics
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) =>
                    handleInputChange("displayName", e.target.value)
                  }
                  placeholder="How should we call you?"
                  className="glass-card"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us a bit about yourself, your background, or what you do..."
                  rows={3}
                  className="glass-card resize-none"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-purple-600" />
              <h2 className="text-xl font-semibold mb-2">Personal Details</h2>
              <p className="text-sm text-muted-foreground">
                Help us personalize your experience
              </p>
            </div>
            <div className="space-y-4">
              <DateOfBirthPicker
                value={formData.dateOfBirth}
                onChange={(date) => handleInputChange("dateOfBirth", date)}
                placeholder="Select your date of birth"
                required
              />
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger className="glass-card">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="w-12 h-12 mx-auto mb-3 text-green-600" />
              <h2 className="text-xl font-semibold mb-2">
                Your Learning Journey
              </h2>
              <p className="text-sm text-muted-foreground">
                What brings you to Recall?
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">What brought you here? *</Label>
                <Select
                  value={formData.reason}
                  onValueChange={(value) => handleInputChange("reason", value)}
                  required
                >
                  <SelectTrigger className="glass-card">
                    <SelectValue placeholder="Select the main reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="learning">
                      Learning & Education
                    </SelectItem>
                    <SelectItem value="productivity">
                      Productivity & Organization
                    </SelectItem>
                    <SelectItem value="creativity">
                      Creativity & Writing
                    </SelectItem>
                    <SelectItem value="research">
                      Research & Knowledge Management
                    </SelectItem>
                    <SelectItem value="personal">
                      Personal Development
                    </SelectItem>
                    <SelectItem value="professional">
                      Professional Growth
                    </SelectItem>
                    <SelectItem value="academic">Academic Research</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="learningGoals">Learning Goals</Label>
                <Textarea
                  id="learningGoals"
                  value={formData.learningGoals}
                  onChange={(e) =>
                    handleInputChange("learningGoals", e.target.value)
                  }
                  placeholder="What do you hope to achieve? (e.g., stay updated with tech trends, improve writing skills, research for a project...)"
                  rows={3}
                  className="glass-card resize-none"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Heart className="w-12 h-12 mx-auto mb-3 text-pink-600" />
              <h2 className="text-xl font-semibold mb-2">Your Interests</h2>
              <p className="text-sm text-muted-foreground">
                What topics fascinate you?
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Topics</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 glass-card rounded-lg">
                  {topicOptions.map((topic) => (
                    <label
                      key={topic}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.preferredTopics.includes(topic)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange("preferredTopics", [
                              ...formData.preferredTopics,
                              topic,
                            ]);
                          } else {
                            handleInputChange(
                              "preferredTopics",
                              formData.preferredTopics.filter(
                                (t) => t !== topic,
                              ),
                            );
                          }
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">{topic}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interests">Other Interests & Hobbies</Label>
                <Textarea
                  id="interests"
                  value={formData.interests}
                  onChange={(e) =>
                    handleInputChange("interests", e.target.value)
                  }
                  placeholder="Tell us about your other interests, hobbies, or passions..."
                  rows={3}
                  className="glass-card resize-none"
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
              <h2 className="text-xl font-semibold mb-2">Preferences</h2>
              <p className="text-sm text-muted-foreground">
                Customize your experience
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dailyReadingTime">
                  How much time do you spend reading/learning daily?
                </Label>
                <Select
                  value={formData.dailyReadingTime}
                  onValueChange={(value) =>
                    handleInputChange("dailyReadingTime", value)
                  }
                >
                  <SelectTrigger className="glass-card">
                    <SelectValue placeholder="Select your daily reading time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-30min">
                      Less than 30 minutes
                    </SelectItem>
                    <SelectItem value="30min-1hour">
                      30 minutes - 1 hour
                    </SelectItem>
                    <SelectItem value="1-2hours">1 - 2 hours</SelectItem>
                    <SelectItem value="2-4hours">2 - 4 hours</SelectItem>
                    <SelectItem value="more-than-4hours">
                      More than 4 hours
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notificationPreference">
                  Notification Preferences
                </Label>
                <Select
                  value={formData.notificationPreference}
                  onValueChange={(value) =>
                    handleInputChange("notificationPreference", value)
                  }
                >
                  <SelectTrigger className="glass-card">
                    <SelectValue placeholder="How would you like to be notified?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily digest</SelectItem>
                    <SelectItem value="weekly">Weekly summary</SelectItem>
                    <SelectItem value="important-only">
                      Important updates only
                    </SelectItem>
                    <SelectItem value="none">No notifications</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                <p className="text-sm text-muted-foreground">
                  🎉 Perfect! We now have everything we need to create your
                  personalized learning experience.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepValidation = () => {
    switch (step) {
      case 1:
        return !formData.displayName || !formData.bio;
      case 2:
        return false; // Optional fields
      case 3:
        return !formData.reason;
      case 4:
        return false; // Optional fields
      case 5:
        return false; // Optional fields
      default:
        return false;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-black dark:to-purple-950 px-4 py-4">
      <div className="w-full max-w-lg">
        <div className="glass-card rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2">
              Complete Your Profile
            </h1>
            <p className="text-muted-foreground">
              Step {step} of 5 - Let's personalize your experience
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-6">
            {renderStep()}

            {/* Terms and final submit for last step */}
            {step === 5 && (
              <div className="flex flex-col w-full items-center space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <label
                    htmlFor="agree"
                    className="text-sm text-muted-foreground select-none"
                  >
                    I agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      className="underline hover:text-primary"
                    >
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      className="underline hover:text-primary"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="glass-card border-white/20 hover:bg-white/70 dark:hover:bg-black/70 px-6 py-2"
              >
                Back
              </Button>

              {step < 5 ? (
                <Button
                  onClick={handleNext}
                  disabled={getStepValidation()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-2"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !agreed}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-2"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Profile...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete Profile</span>
                    </div>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
