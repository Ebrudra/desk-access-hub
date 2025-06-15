
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Building2 } from "lucide-react";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { EmailVerificationPrompt } from "@/components/auth/EmailVerificationPrompt";
import { PasswordUpdate } from "@/components/auth/PasswordUpdate";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";

const EnhancedAuth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  
  const [currentView, setCurrentView] = useState<'auth' | 'forgot' | 'verification'>('auth');
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  const {
    isLoading,
    error,
    verificationEmail,
    setVerificationEmail,
    clearError,
    handleSignIn,
    handleSignUp,
  } = useEnhancedAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && mode !== 'reset') {
      navigate("/");
    }
  }, [user, navigate, mode]);

  // Clear error when switching tabs or views
  useEffect(() => {
    clearError();
  }, [activeTab, currentView, clearError]);

  // Handle password reset mode
  if (mode === 'reset') {
    return <PasswordUpdate />;
  }

  // Show email verification prompt
  if (currentView === 'verification' && verificationEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">WorkspaceHub</span>
          </div>

          <Card>
            <CardContent className="pt-6">
              <EmailVerificationPrompt
                email={verificationEmail}
                onBack={() => {
                  setCurrentView('auth');
                  setVerificationEmail(null);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show forgot password form
  if (currentView === 'forgot') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">WorkspaceHub</span>
          </div>

          <Card>
            <CardContent className="pt-6">
              <ForgotPasswordForm onBack={() => setCurrentView('auth')} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSignInSubmit = async (email: string, password: string) => {
    const result = await handleSignIn(email, password);
    if (result?.needsVerification) {
      setCurrentView('verification');
    }
  };

  const handleSignUpSubmit = async (email: string, password: string, firstName: string, lastName: string) => {
    const result = await handleSignUp(email, password, firstName, lastName);
    if (result?.needsVerification) {
      setCurrentView('verification');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">WorkspaceHub</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SocialAuthButtons 
              isLoading={isLoading} 
              onLoadingChange={() => {}} 
            />

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <SignInForm 
                  onSubmit={handleSignInSubmit} 
                  isLoading={isLoading}
                  onForgotPassword={() => setCurrentView('forgot')}
                />
              </TabsContent>
              
              <TabsContent value="signup">
                <SignUpForm 
                  onSubmit={handleSignUpSubmit} 
                  isLoading={isLoading} 
                />
              </TabsContent>
            </Tabs>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedAuth;
