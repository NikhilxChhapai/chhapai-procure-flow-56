
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { LogIn, ArrowLeft } from 'lucide-react'
import { RoleSelector } from './RoleSelector'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [showRoleSelector, setShowRoleSelector] = useState(false)
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role)
    setShowRoleSelector(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedRole && isSignUp) {
      toast({
        title: 'Role Required',
        description: 'Please select a role before signing up.',
        variant: 'destructive'
      })
      return
    }
    
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          role: selectedRole
        })
        
        if (error) throw error
        
        toast({
          title: 'Account created successfully!',
          description: 'Please check your email to verify your account.',
        })
      } else {
        const { error } = await signIn(email, password)
        
        if (error) throw error
        
        toast({
          title: 'Welcome back!',
          description: 'You have been signed in successfully.',
        })
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during authentication.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (showRoleSelector) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => setShowRoleSelector(false)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex justify-center">
                <LogIn className="h-8 w-8 text-chhapai-gold" />
              </div>
              <div></div>
            </div>
            <CardTitle className="text-2xl font-bold">Choose Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <RoleSelector 
              selectedRole={selectedRole}
              onRoleSelect={handleRoleSelection}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <LogIn className="h-12 w-12 text-chhapai-gold" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </CardTitle>
          <p className="text-gray-600">
            {isSignUp ? 'Join Chhapai Order Management' : 'Welcome back to Chhapai'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Role</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between mt-1"
                    onClick={() => setShowRoleSelector(true)}
                  >
                    {selectedRole ? (
                      <span className="capitalize">{selectedRole}</span>
                    ) : (
                      <span className="text-gray-500">Select your role</span>
                    )}
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black"
              disabled={loading || (isSignUp && !selectedRole)}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setSelectedRole(null)
              }}
              className="text-chhapai-gold hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
