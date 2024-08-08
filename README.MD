# Booster

<br />
<div align="center">
  <h3 align="center">Development Mode with Hot Reload for Rocket.Chat Apps</h3>

  <p align="center">
    <a href="https://github.com/yourusername/rocketbooster">View Demo</a>
    ·
    <a href="https://github.com/yourusername/rocketbooster/issues">Report Bug</a>
    ·
    <a href="https://github.com/yourusername/rocketbooster/issues">Request Feature</a>
  </p>
</div>

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

</div>

## 📜 Getting Started

### Prerequisites

- **Rocket.Chat Server Setup**: Ensure you have a running Rocket.Chat server.
- **Rocket.Chat Apps CLI**: This script uses the Rocket.Chat Apps CLI for deployment.

  - Install the CLI globally if you haven't already:
    ```sh
    npm install -g @rocket.chat/apps-cli
    ```

### ⚙️ Installation

- Follow these steps to set up and use the script:

1. **Clone the repository**
   ```sh
   git clone https://github.com/VipinDevelops/Booster.RC
   ```
2. **Navigate to the project directory**
   ```sh
   cd rocket-chat-deployment-automation
   ```
3. **Install dependencies**

   ```sh
   npm install
   ```

4. **Run the script**

   ```sh
   node index.js
   ```

   The script will prompt you for the following inputs:

   - Rocket.Chat App directory to watch
   - Server URL
   - Username
   - Password

### ✅ About The Project

This project automates the deployment process for Rocket.Chat apps by monitoring a specified directory for changes. It utilizes `chokidar` for file watching and the Rocket.Chat Apps CLI to handle deployments. The script provides real-time feedback on the deployment status, ensuring efficient and streamlined updates to your Rocket.Chat apps.

### 🚀 Usage

- **Starting the Watcher**: Execute the script to begin monitoring the directory for changes.
- **Handling File Changes**: The script automatically triggers the deployment command upon detecting file modifications.

### 🧑‍💻 Contributing

Contributions are greatly appreciated! If you have suggestions or improvements, please follow these steps:

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feat/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'feat: adds some amazing feature'`)
4. **Push to the Branch** (`git push origin feat/AmazingFeature`)
5. **Open a Pull Request**

## 📚 Resources

Here are some helpful resources for Rocket.Chat apps and deployment:

- [Rocket.Chat Apps TypeScript Definitions Documentation](https://rocketchat.github.io/Rocket.Chat.Apps-engine/)
- [Rocket.Chat Apps TypeScript Definitions Repository](https://github.com/RocketChat/Rocket.Chat.Apps-engine)
- [Example Rocket.Chat Apps](https://github.com/graywolf336/RocketChatApps)
- [DemoApp](https://github.com/RocketChat/Rocket.Chat.Demo.App)
- [GithubApp](https://github.com/RocketChat/Apps.Github22)
- Community Forums
  - [App Requests](https://forums.rocket.chat/c/rocket-chat-apps/requests)
  - [App Guides](https://forums.rocket.chat/c/rocket-chat-apps/guides)
  - [Top View of Both Categories](https://forums.rocket.chat/c/rocket-chat-apps)
- [#rocketchat-apps on Open.Rocket.Chat](https://open.rocket.chat/channel/rocketchat-apps)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/VipinDevelops/Booster.RC?style=for-the-badge
[contributors-url]: https://github.com/VipinDevelops/Booster.RC/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/VipinDevelops/Booster.RC?style=for-the-badge
[forks-url]: https://github.com/VipinDevelops/Booster.RC/network/members
[stars-shield]: https://img.shields.io/github/stars/VipinDevelops/Booster.RC?style=for-the-badge
[stars-url]: https://github.com/VipinDevelops/Booster.RC/stargazers
[issues-shield]: https://img.shields.io/github/issues/VipinDevelops/Booster.RC?style=for-the-badge
[issues-url]: https://github.com/VipinDevelops/Booster.RC/issues
[license-shield]: https://img.shields.io/github/license/VipinDevelops/Booster.RC?style=for-the-badge
[license-url]: https://github.com/VipinDevelops/Booster.RC/blob/master/LICENSE.txt
