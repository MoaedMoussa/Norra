// Comprehensive Notion Template Data & Interactive Workspaces for Norra Studio
// Each template includes rich relational databases, custom views, formulas, and 1-click duplication packages

export const TEMPLATE_WORKSPACES = {
  'notion-second-brain': {
    slug: 'notion-second-brain',
    name: 'Second Brain OS',
    tagline: 'Complete digital mind architecture powered by Tiago Forte’s PARA framework and P.A.C.E capture methodology.',
    category: 'Productivity',
    badge: 'PARA Architecture',
    price: 24,
    originalPrice: 49,
    rating: 4.9,
    reviews: 2841,
    image: 'https://images.unsplash.com/photo-1708447134640-2b57ad0dd846?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1708447134640-2b57ad0dd846?w=1400&q=80',
      'https://images.pexels.com/photos/38888656/pexels-photo-38888656.jpeg?w=1400',
      'https://images.pexels.com/photos/7428211/pexels-photo-7428211.jpeg?w=1400'
    ],
    structure: [
      {
        name: 'Projects Hub',
        icon: '🎯',
        desc: 'Active outcomes with hard deadlines and relational task rollups.',
        itemsCount: '8 Active'
      },
      {
        name: 'Areas of Responsibility',
        icon: '🏛️',
        desc: 'Continuous spheres of activity (Health, Finances, Studio, Craft).',
        itemsCount: '6 Spheres'
      },
      {
        name: 'Resource Vault',
        icon: '📚',
        desc: 'Topic-based knowledge repositories, bookmarks, and web clips.',
        itemsCount: '142 Curated'
      },
      {
        name: 'Archive Ledger',
        icon: '📦',
        desc: 'Completed goals and inactive projects safely indexed for reference.',
        itemsCount: '34 Indexed'
      }
    ],
    views: [
      {
        id: 'projects',
        label: 'Projects Matrix',
        type: 'Board',
        columns: ['In Progress', 'Planning', 'Review', 'Completed'],
        records: [
          { title: 'Q3 Architectural Brand Overhaul', area: 'Brand Studio', deadline: 'Oct 15', progress: 85, status: 'In Progress', priority: 'High' },
          { title: 'Notion 3.0 Formula & Logic Migration', area: 'Engineering', deadline: 'Nov 02', progress: 60, status: 'In Progress', priority: 'Critical' },
          { title: 'Personal Fitness Marathon Training', area: 'Health & Vitality', deadline: 'Dec 01', progress: 40, status: 'Planning', priority: 'Medium' },
          { title: 'SaaS Multi-Currency Billing Engine', area: 'Finance', deadline: 'Completed', progress: 100, status: 'Completed', priority: 'Done' }
        ]
      },
      {
        id: 'tasks',
        label: 'Master Tasks & Actions',
        type: 'Table',
        records: [
          { title: 'Review 14 relational database rollups', project: 'Notion 3.0 Migration', context: '@Deep Work', estimate: '45m', done: true },
          { title: 'Capture Kindle book highlights to Resources', project: 'Book Summary Hub', context: '@Capture', estimate: '20m', done: true },
          { title: 'Conduct weekly PARA reset and inbox triage', project: 'Weekly Routine', context: '@Admin', estimate: '30m', done: false },
          { title: 'Audit serverless backend latency metrics', project: 'Brand Overhaul', context: '@Focus', estimate: '1h', done: false }
        ]
      },
      {
        id: 'notes',
        label: 'Knowledge Notes Vault',
        type: 'Cards',
        records: [
          { title: 'Mental Models: First Principles Thinking', tags: ['Cognitive', 'Philosophy'], date: 'Aug 24', readTime: '5 min' },
          { title: 'Notion Formula 2.0 Syntax Reference Sheet', tags: ['Notion', 'Formulas'], date: 'Aug 22', readTime: '8 min' },
          { title: 'Building a High-Output Daily Routine', tags: ['Productivity', 'Habits'], date: 'Aug 19', readTime: '4 min' }
        ]
      }
    ],
    databases: [
      'Projects Database (Linked to Tasks, Areas, Milestones)',
      'Areas Database (Health, Business, Personal, Wealth, Craft)',
      'Resources Database (Articles, Podcasts, Technical Docs)',
      'Master Task Management Database (with Priority matrix)',
      'Weekly & Quarterly Review Database (Reflection prompts)',
      'Reading & Highlight Extraction Vault'
    ]
  },

  'notion-finance-tracker': {
    slug: 'notion-finance-tracker',
    name: 'Finance & Wealth OS',
    tagline: 'Institutional-grade personal finance dashboard with automated cash flow, net worth tracking, and budget metrics.',
    category: 'Finance',
    badge: 'Wealth & Cashflow',
    price: 19,
    originalPrice: 39,
    rating: 4.9,
    reviews: 1932,
    image: 'https://images.pexels.com/photos/38888681/pexels-photo-38888681.jpeg?w=1200',
    gallery: [
      'https://images.pexels.com/photos/38888681/pexels-photo-38888681.jpeg?w=1400',
      'https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?w=1400&q=80'
    ],
    structure: [
      {
        name: 'Cash Flow Dashboard',
        icon: '💵',
        desc: 'Monthly income, fixed expenses, and variable spending analysis.',
        itemsCount: 'Real-time'
      },
      {
        name: 'Net Worth Ledger',
        icon: '📈',
        desc: 'Asset vs liability calculations updated across bank & investment accounts.',
        itemsCount: '6 Accounts'
      },
      {
        name: 'Subscription Auditor',
        icon: '🔄',
        desc: 'Identifies recurring SaaS charges, billing cycles, and unnecessary renewals.',
        itemsCount: '12 Tracked'
      },
      {
        name: 'Savings Goal Vault',
        icon: '🛡️',
        desc: 'Automated milestone progress bars for emergency funds and investments.',
        itemsCount: '4 Active Goals'
      }
    ],
    views: [
      {
        id: 'accounts',
        label: 'Account Balances & Net Worth',
        type: 'Cards',
        records: [
          { account: 'Checking & Liquid Cash', institution: 'Chase Private', balance: '$18,450.00', type: 'Asset', trend: '+4.2%' },
          { account: 'Global Equity Index Fund', institution: 'Vanguard ETF', balance: '$84,200.00', type: 'Investment', trend: '+11.8%' },
          { account: 'Tech Growth Portfolio', institution: 'Fidelity', balance: '$32,100.00', type: 'Investment', trend: '+6.4%' },
          { account: 'Studio Credit Card', institution: 'Amex Business', balance: '-$2,140.00', type: 'Liability', trend: 'Monthly auto-pay' }
        ]
      },
      {
        id: 'budget',
        label: 'Monthly Expense Allocation',
        type: 'Table',
        records: [
          { category: 'Housing & Utilities', allocated: '$2,400', spent: '$2,400', remaining: '$0', status: 'On Budget' },
          { category: 'Food & Dining Out', allocated: '$850', spent: '$620', remaining: '$230', status: 'Under Budget' },
          { category: 'SaaS & Development Tools', allocated: '$350', spent: '$290', remaining: '$60', status: 'Healthy' },
          { category: 'Investments & Savings', allocated: '$2,000', spent: '$2,000', remaining: '$0', status: 'Fulfilled' }
        ]
      },
      {
        id: 'subscriptions',
        label: 'Active Subscriptions Matrix',
        type: 'Table',
        records: [
          { service: 'Notion Plus Subscription', cost: '$10.00 / mo', cycle: 'Annual (Nov)', status: 'Essential', autoRenew: true },
          { service: 'Figma Professional Studio', cost: '$15.00 / mo', cycle: 'Monthly', status: 'Essential', autoRenew: true },
          { service: 'GitHub Pro & Copilot', cost: '$14.00 / mo', cycle: 'Monthly', status: 'Essential', autoRenew: true },
          { service: 'Audible Membership', cost: '$14.95 / mo', cycle: 'Monthly', status: 'Reviewing', autoRenew: false }
        ]
      }
    ],
    databases: [
      'Income Streams Database (Salary, Freelance, Digital Products)',
      'Expenses Ledger (Categorized with formula rollups and monthly filters)',
      'Accounts & Institutions Database (Liquid, Investments, Liabilities)',
      'Subscription Audit & Auto-Renewal Database',
      'Target Savings Goals Database (with dynamic percentage formulas)',
      'Annual Tax Deductions & Receipts Register'
    ]
  },

  'notion-life-planner': {
    slug: 'notion-life-planner',
    name: 'Life Planner Studio',
    tagline: 'Holistic system for intentional living, daily habit loops, goal visualization, and morning & evening rituals.',
    category: 'Planning',
    badge: 'Intentional Living',
    price: 19,
    originalPrice: 39,
    rating: 4.9,
    reviews: 2213,
    image: 'https://images.unsplash.com/photo-1514782831304-632d84503f6f?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514782831304-632d84503f6f?w=1400&q=80',
      'https://images.pexels.com/photos/768472/pexels-photo-768472.jpeg?w=1400'
    ],
    structure: [
      {
        name: 'Daily Rituals & Habits',
        icon: '☀️',
        desc: 'Morning routine, meditation, workout logging, and evening wind-down.',
        itemsCount: 'Daily streak'
      },
      {
        name: 'Vision & Goal Roadmaps',
        icon: '🧭',
        desc: '1-Year, 3-Year, and 5-Year targets broken into quarterly milestones.',
        itemsCount: '5 Big Goals'
      },
      {
        name: 'Wellness & Health Hub',
        icon: '🏃',
        desc: 'Workout splits, nutrition planning, sleep metrics, and hydration counters.',
        itemsCount: 'Active'
      },
      {
        name: 'Life Wheel & Reflections',
        icon: '🎡',
        desc: 'Quarterly self-assessments across 8 life domains with satisfaction scores.',
        itemsCount: '8 Domains'
      }
    ],
    views: [
      {
        id: 'habits',
        label: 'Daily Habit Matrix',
        type: 'Table',
        records: [
          { habit: 'Morning Sunlight & Hydration', target: 'Daily 7:00 AM', streak: '28 Days', score: '100%', done: true },
          { habit: '60-Minute Focused Deep Work', target: 'Mon-Fri', streak: '19 Days', score: '95%', done: true },
          { habit: 'Strength Workout / Zone 2 Cardio', target: '5x / Week', streak: '14 Days', score: '88%', done: true },
          { habit: '10 Pages Non-Fiction Reading', target: 'Daily Evening', streak: '34 Days', score: '98%', done: true },
          { habit: 'Evening Digital Screen Shutdown', target: '10:30 PM', streak: '9 Days', score: '80%', done: false }
        ]
      },
      {
        id: 'goals',
        label: 'Quarterly OKRs & Milestones',
        type: 'Cards',
        records: [
          { goal: 'Launch Norra Studio 2.0 System', quarter: 'Q3 Focus', progress: 90, status: 'On Track', deadline: 'Sep 30' },
          { goal: 'Achieve Sub-20min 5K Run', quarter: 'Q4 Focus', progress: 65, status: 'In Progress', deadline: 'Nov 15' },
          { goal: 'Read 24 Books on Systems & Architecture', quarter: 'Annual', progress: 75, status: 'On Track', deadline: 'Dec 31' }
        ]
      }
    ],
    databases: [
      'Habit Tracker Database (Dynamic completion % and weekly heatmaps)',
      'Vision Board & Life Milestones Database',
      'Daily Journal & Gratitude Log (Structured morning/evening prompts)',
      'Workout & Nutrition Planner Database',
      'Bucket List & Travel Itinerary Database',
      'Quarterly Wheel of Life Review Register'
    ]
  },

  'notion-creator-system': {
    slug: 'notion-creator-system',
    name: 'Creator Pipeline Matrix',
    tagline: 'End-to-end studio OS for YouTube, newsletters, podcasts, and digital creators with sponsor CRM and content calendar.',
    category: 'Business',
    badge: 'Creator Production',
    price: 24,
    originalPrice: 49,
    rating: 4.8,
    reviews: 1421,
    image: 'https://images.pexels.com/photos/38888656/pexels-photo-38888656.jpeg?w=1200',
    gallery: [
      'https://images.pexels.com/photos/38888656/pexels-photo-38888656.jpeg?w=1400',
      'https://images.unsplash.com/photo-1642417188964-870c08705ef3?w=1400&q=80'
    ],
    structure: [
      {
        name: 'Multi-Channel Calendar',
        icon: '🎬',
        desc: 'YouTube, TikTok, Substack, and LinkedIn publishing schedule.',
        itemsCount: '16 In Queue'
      },
      {
        name: 'Sponsor & Deal Pipeline',
        icon: '🤝',
        desc: 'Inquiries, negotiations, contract terms, deliverables, and payment invoicing.',
        itemsCount: '$22,500 Active'
      },
      {
        name: 'Idea Vault & Scorecard',
        icon: '💡',
        desc: 'Capture hooks, thumbnail concepts, and rate ideas by estimated viral ROI.',
        itemsCount: '48 Ideas'
      },
      {
        name: 'Asset & Brand Kit',
        icon: '🎨',
        desc: 'Hex codes, font rules, sponsor media kits, rate cards, and logo exports.',
        itemsCount: 'Complete'
      }
    ],
    views: [
      {
        id: 'content',
        label: 'Production Kanban Pipeline',
        type: 'Board',
        columns: ['Idea Stage', 'Scripting', 'Filming & Edit', 'Ready to Publish'],
        records: [
          { title: 'The Ultimate Minimalist Notion Setup 2026', platform: 'YouTube', stage: 'Ready to Publish', date: 'Aug 28', sponsor: 'CleanShot' },
          { title: 'How I Organize 10,000 Notes with PARA Method', platform: 'YouTube', stage: 'Filming & Edit', date: 'Sep 04', sponsor: 'Audible' },
          { title: '10 Rules for High-Leverage Solopreneurs', platform: 'Substack', stage: 'Scripting', date: 'Aug 26', sponsor: 'None' },
          { title: 'Full Breakdown: Notion 3.0 Formula Updates', platform: 'LinkedIn', stage: 'Idea Stage', date: 'Sep 10', sponsor: 'Open' }
        ]
      },
      {
        id: 'sponsors',
        label: 'Sponsorship Deals CRM',
        type: 'Table',
        records: [
          { sponsor: 'Keychron Mechanical Keyboards', deliverable: 'Dedicated Video (60s)', rate: '$3,500', status: 'Contract Signed', payout: 'Sep 15' },
          { sponsor: 'Setapp Mac Productivity Suite', deliverable: 'Integration (45s)', rate: '$2,800', status: 'Drafting Review', payout: 'Sep 22' },
          { sponsor: 'Morning Brew Newsletter', deliverable: 'Newsletter Cross-promo', rate: '$1,200', status: 'Completed', payout: 'Paid' }
        ]
      }
    ],
    databases: [
      'Master Content Production Pipeline (Script templates, Shot lists)',
      'Sponsor Inquiries & Deal Negotiation CRM',
      'Idea Vault & Viral Scoring Database',
      'Affiliate Links & Promo Code Tracker',
      'Audience Analytics & Platform Growth Register',
      'Guest & Collaboration Outreach Database'
    ]
  },

  'notion-freelance-system': {
    slug: 'notion-freelance-system',
    name: 'Freelance Studio OS',
    tagline: 'Complete client portal, automated proposals, invoice tracking, deliverable sprint boards, and contract archive.',
    category: 'Business',
    badge: 'Client & Operations',
    price: 24,
    originalPrice: 49,
    rating: 4.9,
    reviews: 1108,
    image: 'https://images.pexels.com/photos/7428211/pexels-photo-7428211.jpeg?w=1200',
    gallery: [
      'https://images.pexels.com/photos/7428211/pexels-photo-7428211.jpeg?w=1400',
      'https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?w=1400&q=80'
    ],
    structure: [
      {
        name: 'Client CRM & Portal',
        icon: '💼',
        desc: 'Shareable branded Notion client hubs for project transparency.',
        itemsCount: '12 Clients'
      },
      {
        name: 'Project & Sprint Board',
        icon: '📋',
        desc: 'Milestones, hourly budgets, deliverable checklists, and feedback logs.',
        itemsCount: '4 Active'
      },
      {
        name: 'Invoices & Financials',
        icon: '🧾',
        desc: 'Track sent, overdue, and paid invoices with automatic tax withholdings.',
        itemsCount: '$14.2k Billed'
      },
      {
        name: 'Proposals & Contracts',
        icon: '📜',
        desc: 'Standardized scope of work templates, NDAs, and contract sign-off records.',
        itemsCount: '8 Templates'
      }
    ],
    views: [
      {
        id: 'clients',
        label: 'Active Client Pipeline',
        type: 'Table',
        records: [
          { client: 'Apex Design Collective', project: 'Design System & Token Architecture', contractValue: '$8,500', stage: 'In Progress', delivery: 'Sep 20' },
          { client: 'Kona Coffee Roasters', project: 'E-commerce Brand Refresh', contractValue: '$6,200', stage: 'Final Review', delivery: 'Aug 30' },
          { client: 'Voxel AI Labs', project: 'UI/UX Interactive Mockups', contractValue: '$4,800', stage: 'Proposal Sent', delivery: 'Oct 10' }
        ]
      },
      {
        id: 'invoices',
        label: 'Invoice Tracking & Status',
        type: 'Table',
        records: [
          { invoiceId: 'INV-2026-084', client: 'Apex Design', amount: '$4,250', status: 'Paid', due: 'Aug 15', paidAt: 'Aug 14' },
          { invoiceId: 'INV-2026-085', client: 'Kona Coffee', amount: '$3,100', status: 'Pending Due', due: 'Aug 30', paidAt: '-' },
          { invoiceId: 'INV-2026-086', client: 'Apex Design', amount: '$4,250', status: 'Milestone 2 (Draft)', due: 'Sep 20', paidAt: '-' }
        ]
      }
    ],
    databases: [
      'Clients & Stakeholders CRM (Linked to Projects & Invoices)',
      'Client Projects & Deliverables Sprint Database',
      'Invoice Tracker with Payment Status & PDF Exports',
      'Time Tracker & Billable Hourly Calculator',
      'Contract & Scope-of-Work Template Library',
      'Client Feedback & Testimonial Collector'
    ]
  },

  'notion-business-system': {
    slug: 'notion-business-system',
    name: 'Small Business OS',
    tagline: 'Centralized company wiki, employee directory, sales CRM, sprint manager, and strategic OKR alignment board.',
    category: 'Business',
    badge: 'Enterprise Architecture',
    price: 29,
    originalPrice: 59,
    rating: 4.9,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?w=1400&q=80',
      'https://images.pexels.com/photos/38888656/pexels-photo-38888656.jpeg?w=1400'
    ],
    structure: [
      {
        name: 'Company Knowledge Wiki',
        icon: '🏢',
        desc: 'Mission, values, operating guidelines, brand voice, and SOP manual.',
        itemsCount: '24 Pages'
      },
      {
        name: 'Sales & Leads CRM',
        icon: '📊',
        desc: 'B2B pipeline stages, lead values, contact details, and deal closing dates.',
        itemsCount: '$68k Pipeline'
      },
      {
        name: 'Team & HR Directory',
        icon: '👥',
        desc: 'Org chart, roles, compensation tiers, onboarding guides, and time-off tracker.',
        itemsCount: '12 Members'
      },
      {
        name: 'Product & OKR Roadmap',
        icon: '🚀',
        desc: 'Quarterly objectives, feature sprints, and company-wide KPI dashboards.',
        itemsCount: 'Q3 Active'
      }
    ],
    views: [
      {
        id: 'sales',
        label: 'B2B Sales Pipeline',
        type: 'Board',
        columns: ['Lead In', 'Discovery Call', 'Proposal Sent', 'Won / Active'],
        records: [
          { company: 'Nordic Cloud Systems', dealSize: '$24,000', contact: 'Henrik V.', stage: 'Proposal Sent', prob: '80%' },
          { company: 'Aero Freight Tech', dealSize: '$18,500', contact: 'Sarah M.', stage: 'Discovery Call', prob: '50%' },
          { company: 'Prism Financial AI', dealSize: '$32,000', contact: 'Marcus L.', stage: 'Won / Active', prob: '100%' },
          { company: 'Zenith Logistics Inc', dealSize: '$12,000', contact: 'Elena R.', stage: 'Lead In', prob: '25%' }
        ]
      },
      {
        id: 'wiki',
        label: 'Company Standard Operating Procedures (SOPs)',
        type: 'Table',
        records: [
          { doc: 'Customer Support Escalation Protocol', dept: 'Operations', owner: 'Support Lead', lastUpdated: 'Aug 2026' },
          { doc: 'Brand Voice & Social Copywriting Standards', dept: 'Marketing', owner: 'Content Lead', lastUpdated: 'Jul 2026' },
          { doc: 'Engineering Git PR Review & Release Rules', dept: 'Product', owner: 'CTO', lastUpdated: 'Aug 2026' },
          { doc: 'New Team Member 30-60-90 Day Onboarding', dept: 'People / HR', owner: 'Operations', lastUpdated: 'Jun 2026' }
        ]
      }
    ],
    databases: [
      'Company Wiki & Master SOP Manual',
      'B2B Deals & Opportunity Pipeline CRM',
      'Team Directory, Org Chart & Role Roles',
      'Strategic Objectives & Key Results (OKRs)',
      'Product Feature Sprints & Engineering Roadmap',
      'Vendor & Contractor Registry'
    ]
  },

  'notion-complete-bundle': {
    slug: 'notion-complete-bundle',
    name: 'The Complete Studio Bundle',
    tagline: 'Get instant lifetime access to all 6 high-output Notion systems + all future operating system releases.',
    category: 'Bundle',
    badge: 'All Systems Included',
    price: 49,
    originalPrice: 247,
    rating: 4.9,
    reviews: 6421,
    image: 'https://images.unsplash.com/photo-1642417188964-870c08705ef3?w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1642417188964-870c08705ef3?w=1400&q=80'
    ],
    structure: [
      { name: 'Second Brain OS', icon: '🧠', desc: 'PARA Digital Brain architecture & knowledge vault.', itemsCount: 'Full License' },
      { name: 'Finance & Wealth OS', icon: '📈', desc: 'Net worth, cashflow, budget, and subscription auditor.', itemsCount: 'Full License' },
      { name: 'Life Planner Studio', icon: '☀️', desc: 'Habit loops, vision boards, routines, and daily journal.', itemsCount: 'Full License' },
      { name: 'Creator Pipeline Matrix', icon: '🎬', desc: 'Multi-channel production, sponsor CRM, and idea scorecards.', itemsCount: 'Full License' },
      { name: 'Freelance Studio OS', icon: '💼', desc: 'Client portal, proposals, sprint boards, and invoice tracking.', itemsCount: 'Full License' },
      { name: 'Small Business OS', icon: '🏢', desc: 'Company wiki, sales CRM, team directory, and OKRs.', itemsCount: 'Full License' }
    ],
    views: [
      {
        id: 'bundle',
        label: 'All 6 Master Systems Included',
        type: 'Cards',
        records: [
          { title: 'Second Brain OS', category: 'Productivity', separateValue: '$24', included: 'YES (1-Click)' },
          { title: 'Finance & Wealth OS', category: 'Finance', separateValue: '$19', included: 'YES (1-Click)' },
          { title: 'Life Planner Studio', category: 'Planning', separateValue: '$19', included: 'YES (1-Click)' },
          { title: 'Creator Pipeline Matrix', category: 'Business', separateValue: '$24', included: 'YES (1-Click)' },
          { title: 'Freelance Studio OS', category: 'Business', separateValue: '$24', included: 'YES (1-Click)' },
          { title: 'Small Business OS', category: 'Business', separateValue: '$29', included: 'YES (1-Click)' }
        ]
      }
    ],
    databases: [
      'All 36+ Core Relational Databases across all 6 systems',
      'Global Norra Studio Dashboard linking all modules',
      'Free lifetime upgrades for Notion 3.0+ formula changes',
      'Comprehensive duplication walkthrough and video tutorials'
    ]
  }
};
