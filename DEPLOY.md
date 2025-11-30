# Deployment Guide

This guide will help you deploy your Image Tools website to Vercel using GitHub.

## Prerequisites

1.  **GitHub Account**: [Sign up here](https://github.com/join).
2.  **Vercel Account**: [Sign up here](https://vercel.com/signup).
3.  **Git Installed**: You need Git installed on your computer.
    - [Download Git for Windows](https://git-scm.com/download/win)
    - Install it with default settings.

## Step 1: Initialize Git Repository

Since Git was not detected in your terminal, please follow these steps after installing Git:

1.  Open your terminal (Command Prompt or PowerShell) in the project folder: `c:\Users\abdal\Desktop\web`
2.  Run the following commands one by one:

```bash
git init
git add .
git commit -m "Initial commit"
```

## Step 2: Push to GitHub

1.  Go to [GitHub.com](https://github.com) and sign in.
2.  Click the **+** icon in the top right and select **New repository**.
3.  Name your repository (e.g., `image-tools-web`).
4.  Click **Create repository**.
5.  Copy the commands under "…or push an existing repository from the command line". They will look like this:

```bash
git remote add origin https://github.com/YOUR_USERNAME/image-tools-web.git
git branch -M main
git push -u origin main
```

6.  Paste and run these commands in your terminal.

## Step 3: Deploy to Vercel

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** > **Project**.
3.  Select **Continue with GitHub**.
4.  Find your `image-tools-web` repository and click **Import**.
5.  **Configure Project**:
    - **Framework Preset**: Next.js (should be auto-detected).
    - **Root Directory**: `./` (default).
    - **Build Command**: `next build` (default).
    - **Output Directory**: `.next` (default).
6.  Click **Deploy**.

## Step 4: Verification

Vercel will build your project. Once complete, you will get a live URL (e.g., `image-tools-web.vercel.app`).
Click the link to verify your website is live!

## Troubleshooting

- **Build Failures**: Check the "Logs" tab in Vercel.
- **Git Errors**: Ensure you have configured your git username/email:
    ```bash
    git config --global user.name "Your Name"
    git config --global user.email "your@email.com"
    ```
