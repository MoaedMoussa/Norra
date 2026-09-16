import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  FileText,
  Layers,
  HelpCircle,
  MessageSquare,
  DollarSign,
  CheckCircle2,
  ExternalLink,
  Code2,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FAQ_DATA = [
  // General & Capabilities
  {
    id: 'what-is-norra',
    category: 'general',
    categoryLabel: 'General & Capabilities',
    q: 'What is Norra AI and how does an AI agent builder work?',
    a: 'Norra AI is a no-code AI agent builder that turns your existing company knowledge—websites, documents, Notion pages, and FAQs—into an intelligent conversational assistant. Within minutes, your AI agent is trained to resolve customer questions, qualify sales leads, and provide 24/7 instant support on your website.',
    highlight: 'No coding required — live in under 2 minutes.'
  },
  {
    id: 'chatbase-difference',
    category: 'general',
    categoryLabel: 'General & Capabilities',
    q: 'How is Norra AI different from Chatbase, CustomGPT, and traditional bots?',
    a: 'Unlike rigid rule-based chatbots or older token-metered platforms, Norra AI provides 2,000 message credits on its $12/mo plan (over 2x more than Chatbase\'s $19 plan), includes 100% unbranded white-labeling on all paid tiers, features native interactive lead capture forms, and is powered by state-of-the-art multimodal engines like Google Gemini 3.7 Flash with real-time web search grounding.',
    highlight: 'Better price-to-credit ratio & true white-label branding.'
  },
  {
    id: 'ai-models-used',
    category: 'general',
    categoryLabel: 'General & Capabilities',
    q: 'What AI models power Norra AI agents?',
    a: 'Norra AI uses high-performance foundation models including Google Gemini 3.7 Flash and Gemini 3.1 Pro, combined with our proprietary semantic RAG (Retrieval-Augmented Generation) pipeline. This gives your agent sub-second response times, long context windows, and real-time citation accuracy.',
    highlight: 'Powered by Gemini 3.7 Flash with sub-second response speeds.'
  },
  {
    id: 'multilingual-support',
    category: 'general',
    categoryLabel: 'General & Capabilities',
    q: 'Does Norra AI support multiple languages?',
    a: 'Yes. Even if your knowledge base is uploaded entirely in English, your AI agent automatically detects and responds fluently in over 95+ languages (including Spanish, French, German, Japanese, Arabic, Portuguese, and Mandarin). Visitors receive instant support in their native language.',
    highlight: 'Automatic real-time translation across 95+ languages.'
  },

  // Training & Knowledge
  {
    id: 'supported-sources',
    category: 'training',
    categoryLabel: 'Training & Knowledge',
    q: 'What types of data sources can I use to train my AI agent?',
    a: 'You can train your agent with:\n• Live Website Crawling (crawls entire sitemaps or individual URLs)\n• Documents (PDF, DOCX, TXT, CSV, Markdown)\n• Notion Workspaces (direct sync with your Notion database)\n• Custom Q&A Pairs (curated exact answers for company-specific queries)\n• Raw Text snippets and product catalogs.',
    highlight: 'Supports URLs, PDFs, Notion, Word docs, CSV, and custom Q&As.'
  },
  {
    id: 'prevent-hallucinations',
    category: 'training',
    categoryLabel: 'Training & Knowledge',
    q: 'How does Norra AI guarantee accuracy and prevent hallucinations?',
    a: 'We implement strict RAG constraints with cosine-similarity threshold filtering. The AI is explicitly instructed to only answer using verified context from your uploaded sources. If a user asks a question not covered in your knowledge base, the bot politely acknowledges the limitation and offers to escalate to your human team rather than making up answers.',
    highlight: 'Strict RAG guardrails & human escalation safeguards.'
  },
  {
    id: 'crawl-speed-updates',
    category: 'training',
    categoryLabel: 'Training & Knowledge',
    q: 'How fast is website crawling, and can I update my knowledge base?',
    a: 'Most standard websites (50–200 pages) crawl and vectorize in under 90 seconds. You can re-crawl URLs, upload new PDF revisions, or edit Q&A pairs at any time. Updates reflect in your agent\'s responses immediately without needing to re-embed your widget.',
    highlight: 'Instant updates without modifying your website embed code.'
  },

  // Security & Data Privacy
  {
    id: 'data-privacy-training',
    category: 'security',
    categoryLabel: 'Security & Privacy',
    q: 'Is my data private? Will my proprietary information be used to train public AI models?',
    a: 'No. Your proprietary business data, customer conversations, and uploaded documents are strictly private. We maintain a zero-data-retention policy for model training: your data is NEVER used by Google or third parties to train public foundation models. All data is encrypted at rest (AES-256) and in transit (TLS 1.3) via Cloud Firestore.',
    highlight: 'Enterprise privacy: Your data is NEVER used to train public AI models.'
  },
  {
    id: 'gdpr-compliance',
    category: 'security',
    categoryLabel: 'Security & Privacy',
    q: 'Is Norra AI GDPR and CCPA compliant?',
    a: 'Yes. Norra AI is designed with strict data isolation, configurable data retention windows, and privacy compliance tools. You can export or permanently delete conversation logs and user contacts with a single click.',
    highlight: 'Full data ownership with 1-click export and deletion.'
  },

  // Integrations & Customization
  {
    id: 'website-embed-integration',
    category: 'integrations',
    categoryLabel: 'Integrations & Customization',
    q: 'How do I install the AI chatbot on my website or application?',
    a: 'Installation takes under 60 seconds. Simply copy a single line of JavaScript `<script>` tag and paste it into your site\'s HTML `<head>` or `<body>`. Norra AI works seamlessly with WordPress, Shopify, Webflow, Wix, Squarespace, Framer, Ghost, React, Vue, Next.js, and standard HTML.',
    highlight: '1-line embed code compatible with Shopify, WordPress, Webflow, & React.'
  },
  {
    id: 'lead-generation-forms',
    category: 'integrations',
    categoryLabel: 'Integrations & Customization',
    q: 'Can the AI agent collect leads and capture contact information?',
    a: 'Yes! You can enable custom lead capture triggers (e.g., asking for an email/phone number before the chat starts or during high-intent queries). Collected leads appear instantly in your dashboard and can be exported as CSV or synced to your CRM via webhooks.',
    highlight: 'Built-in lead capture with email, phone, and webhook CRM forwarding.'
  },
  {
    id: 'branding-customization',
    category: 'integrations',
    categoryLabel: 'Integrations & Customization',
    q: 'Can I customize the chatbot\'s appearance, avatar, and remove Norra branding?',
    a: 'Absolutely. You have full control over brand primary colors, widget positioning, launcher icons, welcome greetings, bot avatar image, suggested starter chips, and dark/light modes. On all paid plans, you can completely remove the "Powered by Norra" badge for a 100% white-label experience.',
    highlight: '100% customizable theme with complete white-label branding.'
  },

  // Pricing & Billing
  {
    id: 'message-credit-definition',
    category: 'pricing',
    categoryLabel: 'Pricing & Billing',
    q: 'What counts as 1 message credit?',
    a: 'One message credit equals one full response generated by your AI agent, regardless of word count or token length. User questions and initial greeting messages are always free. Unused credits don\'t generate surprise overages.',
    highlight: '1 message credit = 1 complete AI response. No token multipliers.'
  },
  {
    id: 'cancel-or-change-plan',
    category: 'pricing',
    categoryLabel: 'Pricing & Billing',
    q: 'Can I upgrade, downgrade, or cancel my subscription at any time?',
    a: 'Yes. You can switch between Monthly and Annual billing, upgrade to a higher tier as your traffic grows, or cancel anytime directly from your dashboard with 1 click. There are zero cancellation fees, and your chatbots and data remain securely stored.',
    highlight: '1-click self-service cancellation with zero hidden fees.'
  },
  {
    id: 'free-tier-available',
    category: 'pricing',
    categoryLabel: 'Pricing & Billing',
    q: 'Is there a free trial or free forever plan?',
    a: 'Yes! You can get started immediately on our Free Forever plan without entering a credit card. It includes full access to the AI Studio builder, web crawling, document uploads, and 20 monthly messages. All paid plans include a 14-day risk-free trial.',
    highlight: 'Start free without a credit card. 14-day trial on all paid tiers.'
  }
];

const CATEGORIES = [
  { key: 'all', label: 'All Questions', icon: HelpCircle },
  { key: 'general', label: 'General & AI', icon: Sparkles },
  { key: 'training', label: 'Training & Accuracy', icon: FileText },
  { key: 'security', label: 'Security & Privacy', icon: ShieldCheck },
  { key: 'integrations', label: 'Embed & Leads', icon: Code2 },
  { key: 'pricing', label: 'Pricing & Billing', icon: DollarSign }
];

export default function FaqSection({ className = '' }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({ 'what-is-norra': true });

  // Filter FAQs based on category and search query
  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const qLower = searchQuery.toLowerCase();
      return (
        item.q.toLowerCase().includes(qLower) ||
        item.a.toLowerCase().includes(qLower) ||
        item.categoryLabel.toLowerCase().includes(qLower) ||
        (item.highlight && item.highlight.toLowerCase().includes(qLower))
      );
    });
  }, [activeCategory, searchQuery]);

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandAll = () => {
    const allOpen = {};
    filteredFaqs.forEach((item) => {
      allOpen[item.id] = true;
    });
    setOpenItems(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenItems({});
  };

  // Structured JSON-LD for Google SEO Rich Snippets (FAQPage schema)
  const faqSchemaJson = useMemo(() => {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_DATA.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a.replace(/\n/g, '<br/>')
        }
      }))
    });
  }, []);

  return (
    <section
      id="faq-section"
      className={`py-16 sm:py-24 border-b border-slate-200 bg-white relative overflow-hidden ${className}`}
      aria-label="Frequently Asked Questions"
    >
      {/* Google SEO Structured Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqSchemaJson }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold shadow-xs">
            <ShieldCheck size={14} className="text-blue-600" />
            <span>Clear Answers • Verified AI Architecture</span>
          </div>

          <h2 className="display text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Everything you need to know about building, training, embedding, and scaling custom AI agents for your business.
          </p>
        </div>

        {/* Search & Quick Controls Bar */}
        <div className="space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              id="faq-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g., 'privacy', 'Shopify', 'Gemini', 'pricing')..."
              className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white shadow-xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  id={`faq-tab-${cat.key}`}
                  onClick={() => {
                    setActiveCategory(cat.key);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-950 text-sports-text shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <Icon size={13} className={isActive ? 'text-blue-400' : 'text-slate-500'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Results meta & Expand/Collapse toggles */}
          <div className="flex items-center justify-between text-xs text-slate-500 max-w-4xl mx-auto px-1 pt-2">
            <span>
              Showing <strong className="text-slate-800 font-semibold">{filteredFaqs.length}</strong> of{' '}
              {FAQ_DATA.length} questions
              {searchQuery && ` for "${searchQuery}"`}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExpandAll}
                className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-medium"
              >
                Expand all
              </button>
              <span>•</span>
              <button
                onClick={handleCollapseAll}
                className="text-slate-500 hover:text-slate-700 hover:underline cursor-pointer font-medium"
              >
                Collapse all
              </button>
            </div>
          </div>
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-3 max-w-4xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
              <HelpCircle size={32} className="mx-auto text-slate-400" />
              <div className="text-sm font-semibold text-slate-800">
                No matching questions found
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find an answer matching "{searchQuery}". Try a different keyword or explore our full documentation.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer shadow-xs"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((item) => {
              const isOpen = Boolean(openItems[item.id]);
              return (
                <div
                  key={item.id}
                  id={`faq-item-${item.id}`}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-blue-200 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md">
                          {item.categoryLabel}
                        </span>
                      </div>
                      <h3
                        itemProp="name"
                        className={`text-sm sm:text-base font-semibold transition ${
                          isOpen ? 'text-blue-900' : 'text-slate-900'
                        }`}
                      >
                        {item.q}
                      </h3>
                    </div>

                    <div
                      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 ${
                        isOpen
                          ? 'bg-blue-600 text-sports-text rotate-180'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <ChevronDown size={15} />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${item.id}`}
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                      className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-blue-100/60 space-y-3"
                    >
                      <div itemProp="text" className="whitespace-pre-line text-slate-700">
                        {item.a}
                      </div>

                      {item.highlight && (
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-900 text-xs font-medium">
                          <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                          <span>{item.highlight}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom High-Trust Support & Live Demo Callout */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-sports-text shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-semibold text-emerald-300">
                Live AI Assistant Ready
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold font-display">
              Have a specific question not covered here?
            </h4>
            <p className="text-xs text-slate-300 max-w-md">
              Test Norra right now! Ask our embedded Copilot agent in the bottom-right corner or consult our technical guides.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              to="/docs"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sports-text text-xs font-semibold border border-white/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <FileText size={14} />
              Read Documentation
            </Link>
            <Link
              to="/create"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sports-text text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Zap size={14} />
              Build Free Agent Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
