module.exports = {
  title: 'Hokusai Docs',
  tagline: 'Fair Incentives for Training Smarter AI',
  url: 'https://docs.hokus.ai',
  baseUrl: '/',
  organizationName: 'Hokusai-protocol',
  projectName: 'hokusai-docs',
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Add presets configuration
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          showLastUpdateTime: true,
          breadcrumbs: true,
        },
        blog: {
          showReadingTime: true,
          blogTitle: 'Hokusai Blog',
          blogDescription: 'Updates and insights about the Hokusai protocol',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      type: 'text/css',
    },
  ],

  themeConfig: {
    // Announcement bar for important updates
    // announcementBar: {
    //   id: 'mainnet_launch',
    //   content: '🚀 Hokusai Protocol is now live on mainnet! <a href="https://hokus.ai">Learn more</a>',
    //   backgroundColor: '#2851e3',
    //   textColor: '#ffffff',
    //   isCloseable: true,
    // },

    navbar: {
      title: 'Hokusai',
      hideOnScroll: false,
      logo: {
        alt: 'Hokusai Protocol',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
        width: 40,
        height: 40,
      },
      items: [
        {
          to: '/',
          label: 'Docs',
          position: 'left',
          activeBaseRegex: '^/$|^/(?!api|community|blog)',
        },
        {
          to: '/tokenomics',
          label: 'Tokenomics',
          position: 'left',
        },
        {
          to: '/smart-contracts/smart-contracts-overview',
          label: 'Smart Contracts',
          position: 'left',
        },
        {
          to: '/guides/investor-guide',
          label: 'Guides',
          position: 'left',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://github.com/Hokusai-protocol',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          href: 'https://hokus.ai',
          label: 'Main Site →',
          position: 'right',
          className: 'navbar__link--main-site',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Hokusai Protocol',
        src: 'img/logo.svg',
        width: 40,
        height: 40,
        href: 'https://hokus.ai',
      },
      links: [
        {
          title: 'Protocol',
          items: [
            { label: 'How It Works', href: 'https://hokus.ai/how-it-works' },
            { label: 'Explore Models', href: 'https://hokus.ai/explore-models' },
            { label: 'Data Suppliers', href: 'https://hokus.ai/data-suppliers' },
            { label: 'AI Developers', href: 'https://hokus.ai/ai-developers' },
          ],
        },
        {
          title: 'Documentation',
          items: [
            { label: 'Getting Started', to: '/' },
            { label: 'Tokenomics', to: '/tokenomics' },
            { label: 'Smart Contracts', to: '/smart-contracts/smart-contracts-overview' },
            { label: 'API Reference', to: '/api-reference' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/Hokusai-protocol' },
            { label: 'Discord', href: 'https://discord.gg/hokusai' },
            { label: 'Twitter', href: 'https://twitter.com/hokusai_protocol' },
          ],
        },
        {
          title: 'Resources',
          items: [
            { label: 'Investor Guide', to: '/guides/investor-guide' },
            { label: 'Contact Us', href: 'https://hokus.ai/contact' },
            { label: 'Main Site', href: 'https://hokus.ai' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Hokusai Protocol Contributors`,
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    prism: {
      theme: require('prism-react-renderer').themes.github,
      darkTheme: require('prism-react-renderer').themes.dracula,
      additionalLanguages: ['solidity', 'bash', 'json', 'typescript'],
    },
  },

  themes: [
    '@docusaurus/theme-mermaid',
  ],

  markdown: {
    mermaid: true,
  },
};