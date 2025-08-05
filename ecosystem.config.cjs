module.exports = {
  apps: [
    {
      name: "office-tij-backend",
      script: "./index.js",
      node_args: "--max-old-space-size=1024",
      watch: false, // set to true only during dev
      max_restarts: 5,
      restart_delay: 5000, // wait 5s between restarts
      env: {
        NODE_ENV: "production"
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm Z"
    }
  ]
};
