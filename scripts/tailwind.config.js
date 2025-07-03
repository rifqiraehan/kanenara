module.exports = {
  safelist: [
    'bg-gray-100',
    'bg-yellow-100',
    'bg-green-100',
    'bg-blue-100',
    'bg-red-100',

    'bg-gray-400',
    'bg-yellow-400',
    'bg-green-400',
    'bg-blue-400',
    'bg-red-400',

    'bg-gray-200',
    'bg-yellow-200',
    'bg-green-200',
    'bg-blue-200',
    'bg-red-200',

    {
      pattern: /bg-(gray|yellow|green|blue|red)-(100)/,
    },
    {
      pattern: /bg-(gray|yellow|green|blue|red)-(200)/,
    },
    {
      pattern: /bg-(gray|yellow|green|blue|red)-(400)/,
    },

    'text-gray-800',
    'text-yellow-800',
    'text-green-800',
    'text-blue-800',
    'text-red-800',

    {
      pattern: /text-(gray|yellow|green|blue|red)-(800)/,
    },
  ],

  theme: {
    extend: {},
  },
  plugins: [],
}