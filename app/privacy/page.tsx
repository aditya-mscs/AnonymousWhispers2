export default function PrivacyPage() {
  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="lead">
          At Anonymous Dark Secrets, we take your privacy very seriously. This Privacy Policy explains how we collect,
          use, and protect your information.
        </p>

        <h2>Information We Collect</h2>
        <p>We collect minimal information to provide our service:</p>
        <ul>
          <li>IP addresses (stored in a hashed format for security purposes)</li>
          <li>Content you choose to share on our platform</li>
          <li>Basic usage analytics to improve our service</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide and maintain our service</li>
          <li>Prevent abuse and ensure platform safety</li>
          <li>Improve and optimize our platform</li>
        </ul>

        <h2>Information Security</h2>
        <p>We implement appropriate security measures to protect your information:</p>
        <ul>
          <li>All data is encrypted in transit and at rest</li>
          <li>Personal identifiers are hashed and anonymized</li>
          <li>Regular security audits and updates</li>
        </ul>

        <h2>Data Retention</h2>
        <p>
          We retain your content for as long as you wish it to remain on our platform. You can request deletion at any
          time.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Request deletion of your content</li>
          <li>Access information we hold about you</li>
          <li>Object to our use of your information</li>
        </ul>

        <h2>Changes to This Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@anonymousdarksecrets.com.
        </p>
      </div>
    </div>
  )
}

