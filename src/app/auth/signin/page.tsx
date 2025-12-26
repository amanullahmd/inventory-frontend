import LoginForm from "@/components/auth/LoginForm"

const DUMMY_CREDENTIALS = [
  { email: 'testuser@example.com', password: 'TestPassword123', role: 'User' },
  { email: 'admin@example.com', password: 'Admin@123456', role: 'Admin' },
  { email: 'user@example.com', password: 'User@123456', role: 'User' },
]

export default function SignIn() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div>
              <h1 className="text-4xl font-semibold text-foreground">Sign in</h1>
              <p className="mt-1 text-sm text-muted-foreground">Inventory Management System</p>
            </div>

            <div className="mt-6">
              <LoginForm />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Demo credentials</h2>
            <div className="mt-3 space-y-2">
              {DUMMY_CREDENTIALS.map((cred, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-background p-3">
                  <div className="text-xs font-semibold text-foreground">{cred.role}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Email: <span className="font-mono text-foreground">{cred.email}</span></div>
                  <div className="text-xs text-muted-foreground">Password: <span className="font-mono text-foreground">{cred.password}</span></div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Use any of these credentials to test the application.</p>
          </div>
        </div>
      </div>
    </div>
  )
}