module.exports = {
  apps: [
    {
      name: "Office-tij-backend",
      script: "./index.js", // your main entry file
      node_args: "--max-old-space-size=1024",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
