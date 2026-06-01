module.exports = {
  title: 'Hokusai Docs',
  tagline: 'Shared decision layers for AI systems',
  url: 'https://docs.hokus.ai',
  baseUrl: '/',
  trailingSlash: false,
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

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        // Preserve indexed legacy licensing routes after the underlying docs were removed.
        redirects: [
          {
            from: ['/licensing/proprietary', '/licensing/open-source'],
            to: '/licensing/overview',
          },
        ],
      },
    ],
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
          to: '/technical-task-router/quickstart',
          label: 'Router',
          position: 'left',
        },
        {
          to: '/inside-a-routing-decision',
          label: 'How It Works',
          position: 'left',
        },
        {
          to: '/contributor-rewards/routing-rewards',
          label: 'Rewards',
          position: 'left',
        },
        {
          to: '/smart-contracts/smart-contracts-overview',
          label: 'Protocol',
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
            { label: 'Technical Task Router', to: '/technical-task-router/quickstart' },
            { label: 'Inside a Routing Decision', to: '/inside-a-routing-decision' },
            { label: 'Contributor Rewards', to: '/contributor-rewards/routing-rewards' },
            { label: 'Smart Contracts', to: '/smart-contracts/smart-contracts-overview' },
          ],
        },
        {
          title: 'Documentation',
          items: [
            { label: 'Getting Started', to: '/' },
            { label: 'Task Packets', to: '/technical-task-router/task-packets' },
            { label: 'Outcome Reporting', to: '/technical-task-router/outcome-reporting' },
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
            { label: 'Rewards and Fee Flow', to: '/tokenomics' },
            { label: 'Legacy Model Workflows', to: '/using-models' },
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
      additionalLanguages: ['solidity', 'bash', 'json', 'typescript', 'python', 'go'],
    },
  },

  themes: [
    '@docusaurus/theme-mermaid',
  ],

  markdown: {
    mermaid: true,
  },
};
