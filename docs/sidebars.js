const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['intro'],
    },
    {
      type: 'category',
      label: 'Contributing Data',
      items: ['supplying-data'],
    },
    {
      type: 'category',
      label: 'Creating Models',
      items: ['creating-models', 'improving-models'],
    },
    {
      type: 'category',
      label: 'Using Models',
      items: ['using-models'],
    },
    {
      type: 'category',
      label: 'Tokenomics',
      items: ['tokenomics'],
    },
    {
      type: 'category',
      label: 'Smart Contracts',
      items: [
        'smart-contracts/smart-contracts-overview',
        'smart-contracts/model-tokens-and-token-manager',
        'smart-contracts/verifier-and-contribution',
        'smart-contracts/treasury-and-access',
        'smart-contracts/governance-and-security',
      ],
    },
    {
      type: 'category',
      label: 'Licensing',
      items: [
        'licensing/overview',
        'licensing/open-source',
        'licensing/commercial',
        'licensing/co-op',
        'licensing/proprietary',
      ],
    },
    'api-reference',
    'governance',
    'faqs',
  ],
};

module.exports = sidebars;