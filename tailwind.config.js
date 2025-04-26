/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{tsx,ts,jsx,js}"],
    theme: {
      extend: {
        colors: {
          primary: "#0066FF",
          secondary: "#6B7280",
          background: "#F9FAFB",
          sidebar: "#1E293B",
          textPrimary: "#1F2937",
          textSecondary: "#6B7280",
          success: "#22C55E",
          danger: "#EF4444",
          info: "#3B82F6",
          white: "#FFFFFF",
          border: "#E5E7EB",
        },
      },
    },
    plugins: [],
  };