module.exports = {
  apps: [
    {
      // business.tecma.com -> puerto 50022
      name: "billing-portal",
      cwd: "C:/TECMA Services/Business-TECMA/Dev",
      script: "node",
      args: "node_modules/next/dist/bin/next start -p 50022",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      node_args: "--max-old-space-size=2048",
      max_memory_restart: "1500M",
      env: {
        NODE_ENV: "production",
        // URL de la Finances API. También puede definirse en un archivo .env.production.
        // FCP_API_BASE_URL: "",
      },
      out_file: "./logs/prod-out.log",
      error_file: "./logs/prod-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    }
  ]
};
