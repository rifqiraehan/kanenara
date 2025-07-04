module.exports = {
  safelist: [
    'bg-gray-100', 'bg-yellow-100', 'bg-green-100', 'bg-blue-100', 'bg-red-100',
    'bg-gray-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-red-400',
    'bg-gray-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-red-200',

    'text-gray-800', 'text-yellow-800', 'text-green-800', 'text-blue-800', 'text-red-800',

    'bg-orange-100', 'bg-amber-100', 'bg-lime-100', 'bg-emerald-100', 'bg-teal-100',
    'bg-cyan-100', 'bg-sky-100', 'bg-indigo-100', 'bg-violet-100', 'bg-purple-100',
    'bg-fuchsia-100', 'bg-pink-100',

    'text-orange-800', 'text-amber-800', 'text-lime-800', 'text-emerald-800', 'text-teal-800',
    'text-cyan-800', 'text-sky-800', 'text-indigo-800', 'text-violet-800', 'text-purple-800',
    'text-fuchsia-800', 'text-pink-800',

    'bg-orange-400', 'bg-amber-400', 'bg-lime-400', 'bg-emerald-400', 'bg-teal-400',
    'bg-cyan-400', 'bg-sky-400', 'bg-indigo-400', 'bg-violet-400', 'bg-purple-400',
    'bg-fuchsia-400', 'bg-pink-400',

    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500',
    'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
    'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
    'bg-pink-500',
    {
      pattern: /bg-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink)-(500|600)/,
      variants: ['hover', 'active'],
    },


    {
      pattern: /bg-(gray|yellow|green|blue|red|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink)-(100|200|400|500)/,
    },
    {
      pattern: /text-(gray|yellow|green|blue|red|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink)-(800|900)/,
    },
  ],

  theme: {
    extend: {},
  },
  plugins: [],
}