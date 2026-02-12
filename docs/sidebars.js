const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'intro',
        'getting-started',
        'getting-started/quick-start',
        'getting-started/first-contribution',
        'configuration',
        'key-concepts',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/model-launch-guide',
        'guides/choosing-crr',
        'guides/investor-guide',
        'guides/buying-tokens',
        'guides/selling-tokens',
      ],
    },
    {
      type: 'category',
      label: 'Core Workflows',
      items: [
        'supplying-data',
        'data-validation-tools',
        'privacy-compliance',
        'creating-models',
        'improving-models',
        'using-models',
        'core-workflows/architecture',
      ],
    },
    {
      type: 'category',
      label: 'ML Infrastructure',
      items: [
        'ml-infrastructure/ml-infrastructure-overview',
        'ml-infrastructure/pipeline-architecture',
        'ml-infrastructure/platform-features',
      ],
    },
    {
      type: 'category',
      label: 'Authentication',
      items: [
        'authentication/overview',
        'authentication/registration',
        'authentication/quickstart',
        'authentication/api-keys',
        'authentication/validation',
        'authentication/usage-billing',
        'authentication/security',
        'authentication/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Tokenomics',
      items: [
        'tokenomics',
        'tokenomics/token-value',
        'tokenomics/amm-overview',
        'tokenomics/bonding-curve',
        'tokenomics/launch-period',
        'tokenomics/api-fee-flow',
        'tokenomics/deltaone-calculations',
      ],
    },
    {
      type: 'category',
      label: 'Smart Contracts',
      items: [
        'smart-contracts/smart-contracts-overview',
        'smart-contracts/hokusai-amm',
        'smart-contracts/token-flow',
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
        'licensing/decentralized',
        'licensing/open-source',
        'licensing/proprietary',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'api-reference',
        'governance',
        'faqs',
      ],
    },
  ],
};

module.exports = sidebars;