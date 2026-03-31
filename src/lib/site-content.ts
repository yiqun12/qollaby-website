export const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/rules", label: "Rules" },
  { href: "/privacy", label: "Privacy" },
  { href: "/support", label: "Support" },
  { href: "#download", label: "Download" },
] as const;

export const supportFaqs = [
  {
    question: "How do I create an account?",
    answer:
      "Download Qollaby from the App Store or Google Play, open the app, and tap Sign Up. You can register with your email, Google account, or Apple ID.",
  },
  {
    question: "How do I reset my password?",
    answer:
      'On the login screen, tap "Forgot Password?" and enter the email address you used to register. You\'ll receive a link to create a new password.',
  },
  {
    question: "How do I delete my account?",
    answer:
      "Go to your Profile, tap Edit Profile, then scroll down and tap \"Delete Account\". Follow the confirmation steps to permanently remove your account and data.",
  },
  {
    question: "How do I report inappropriate content?",
    answer:
      "Tap the menu icon on any post, listing, or profile and select Report. Choose the reason and submit. Our team reviews all reports promptly.",
  },
  {
    question: "How do I manage notifications?",
    answer:
      "You can control push notifications through your device Settings > Qollaby > Notifications. Within the app, notification preferences are tied to your device settings.",
  },
  {
    question: "How do sponsor ads work?",
    answer:
      "Businesses and community partners can create sponsor ads that appear in the feed. Visit the Sponsors section in the app to learn about pricing and ad creation.",
  },
] as const;

export const homeFeatures = [
  {
    id: "discover",
    eyebrow: "Discover what matters",
    title: "Explore a local feed built around ideas, work, opportunities, and exchange.",
    description:
      "Qollaby brings community posts, exchange listings, events, and sponsor highlights into one scrolling experience so people can quickly find what is relevant nearby.",
    bullets: [
      "Browse posts, events, and exchange listings in one feed.",
      "Filter by category and local context.",
      "Surface sponsor placements without breaking the browsing flow.",
    ],
    screenshot: "/images/screenshot-discover.png",
    screenshotAlt: "Qollaby home feed with posts, exchanges, and sponsor cards",
    reverse: false,
  },
  {
    id: "message",
    eyebrow: "Connect directly",
    title: "Move from discovery to conversation without leaving the app.",
    description:
      "Messages, linked post cards, and conversation threads help people respond quickly when a post, event, or listing is worth following up on.",
    bullets: [
      "Dedicated inbox for active conversations.",
      "Linked post previews keep context inside the chat.",
      "Built for fast outreach after discovery.",
    ],
    screenshot: "/images/screenshot-messages.png",
    screenshotAlt: "Qollaby messages inbox with conversations and friends tab",
    reverse: true,
  },
  {
    id: "exchange",
    eyebrow: "Trade and exchange",
    title: "Support listings, bids, and exchange workflows in one place.",
    description:
      "From browsing exchange posts to reviewing item details and offers, Qollaby helps communities coordinate transactions with clearer context and intent.",
    bullets: [
      "Dedicated exchange browsing flow.",
      "Detail views with media and offer context.",
      "Rules reinforce responsible bidding behavior.",
    ],
    screenshot: "/images/screenshot-exchange.png",
    screenshotAlt: "Qollaby exchange listing detail with bid and pricing info",
    reverse: false,
  },
  {
    id: "events",
    eyebrow: "Attend local events",
    title: "Highlight what is happening nearby with event-first discovery.",
    description:
      "Qollaby gives communities a simple way to promote and browse events without separating them from the rest of the network.",
    bullets: [
      "Events live alongside the main feed.",
      "Media-rich cards make event discovery visual.",
      "Community content stays connected across categories.",
    ],
    screenshot: "/images/screenshot-events.png",
    screenshotAlt: "Qollaby events feed with dated event cards and sponsors",
    reverse: true,
  },
  {
    id: "sponsors",
    eyebrow: "Promote your brand",
    title: "Give businesses and community partners a native place to show up.",
    description:
      "Sponsor ads and promotion tools let brands participate in the community experience while keeping a clear visual distinction from member posts.",
    bullets: [
      "Sponsor ad cards appear directly in feed slots.",
      "Dedicated sponsor detail pages support richer storytelling.",
      "Useful for local businesses, campaigns, and community initiatives.",
    ],
    screenshot: "/images/screenshot-sponsors.png",
    screenshotAlt: "Qollaby sponsor ads management with active ads and plan info",
    reverse: false,
  },
] as const;

export const rulesOfEngagement = [
  {
    number: 1,
    title: "Be real.",
    description: "Use your real voice. No impersonation or fake accounts.",
  },
  {
    number: 2,
    title: "Be respectful.",
    description: "Disagreement is fine. Harassment, hate, or threats are not.",
  },
  {
    number: 3,
    title: "Add value.",
    description:
      "Share things that contribute-ideas, work, opportunities, or insight.",
  },
  {
    number: 4,
    title: "No spam or scams.",
    description: "Don't flood the platform or mislead others.",
  },
  {
    number: 5,
    title: "Respect privacy.",
    description: "Don't share private or personal information without consent.",
  },
  {
    number: 6,
    title: "Follow the law.",
    description: "Illegal content or activity isn't allowed.",
  },
  {
    number: 7,
    title: "No misleading use of AI.",
    description:
      "AI is allowed. Deception isn't. Don't use AI to impersonate, misrepresent, or mislead.",
  },
  {
    number: 8,
    title: "No inappropriate images.",
    description:
      "Images or videos with nudity, vulgar or heinous acts, physical violence, or sexual acts will be removed.",
  },
  {
    number: 9,
    title: "No False Bids.",
    description:
      "Do not enter any auction without full intention of fulfilling the financial commitment.",
  },
] as const;

export const rulesPageSections = [
  { id: "overview", label: "Overview" },
  { id: "rules", label: "Rules" },
  { id: "reporting", label: "Reporting" },
  { id: "enforcement", label: "Enforcement" },
] as const;

export const privacyPageSections = [
  { id: "intro", label: "Introduction" },
  { id: "info-collected", label: "Information we collect" },
  { id: "how-used", label: "How we use it" },
  { id: "sharing", label: "Sharing and disclosure" },
  { id: "retention", label: "Data retention" },
  { id: "security", label: "Security" },
  { id: "children", label: "Children's privacy" },
  { id: "rights", label: "Your rights" },
  { id: "changes", label: "Changes to this policy" },
  { id: "contact", label: "Contact us" },
] as const;
