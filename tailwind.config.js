/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"], // font-inter
      },
      colors: {
        // Core
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",

        // Semantic
        success: {
          DEFAULT: "hsl(var(--success))",
          10: "hsl(var(--success) / 0.1)",
          20: "hsl(var(--success) / 0.2)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          10: "hsl(var(--warning) / 0.1)",
          20: "hsl(var(--warning) / 0.2)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          10: "hsl(var(--destructive) / 0.1)",
          20: "hsl(var(--destructive) / 0.2)",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          10: "hsl(var(--info) / 0.1)",
          20: "hsl(var(--info) / 0.2)",
        },
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      transitionProperty: {
        base: "var(--transition-base)",
        slow: "var(--transition-slow)",
      },
    },
  },
  plugins: [],
};
