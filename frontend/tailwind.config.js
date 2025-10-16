import scrollbar from 'tailwind-scrollbar'

export default {
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ["Ubuntu", "sans-serif"],
      },
    },
  },
  plugins: [
    scrollbar({ nocompatible: true }),
  ],
}
