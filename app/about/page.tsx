import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="w-full px-4 py-8 space-y-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">About Anonymous Dark Secrets</h1>
        <p className="text-xl text-muted-foreground">A safe space for sharing your deepest thoughts without judgment</p>
      </div>

      <div className="max-w-4xl mx-auto w-full grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>The simple process of sharing your secrets anonymously</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">1. Share Your Secret</h3>
              <p>Type or use voice-to-text to share your secret. Rate how dark you think it is.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">2. Anonymous Identity</h3>
              <p>We generate a random funny username for you. Your real identity remains completely private.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">3. Engage With Others</h3>
              <p>Read, like, and comment on secrets shared by others. Find comfort in knowing you&apos;re not alone.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What We Do</CardTitle>
            <CardDescription>Our mission and values</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Anonymous Dark Secrets provides a platform where people can share their deepest thoughts, confessions, and
              secrets without fear of judgment or identification.
            </p>
            <p>
              We believe that everyone has thoughts they need to express but may not feel comfortable sharing with
              people they know. Our platform offers that release valve.
            </p>
            <p>
              <strong>Privacy Promise:</strong> We do not store personal information that could identify you. Your
              secrets remain anonymous, and your privacy is our top priority.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Future Enhancements</CardTitle>
            <CardDescription>What&apos;s coming next to Anonymous Dark Secrets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Community Features</h3>
              <p>Secret categories, themed collections, and community challenges.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Enhanced Anonymity</h3>
              <p>Additional privacy features and encryption for even greater security.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Mobile Apps</h3>
              <p>Native mobile applications for iOS and Android for a better mobile experience.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Mental Health Resources</h3>
              <p>Integration with mental health resources for those who might need support.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

