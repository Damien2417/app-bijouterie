<h1 align="center"><img src="./docs/images/bullet.svg" width="19" /> Electron App</h1>

Jeweler managing app with react.


# <img src="./docs/images/bullet.svg" width="19" /> Features
- **Stands out**
  - 🔥 Fast and Ready-to-go with a well-thought-out structure
  - 🚀 Auto reload for main and **Fast Refresh** for renderer process
  - 🎉 Window and Screen routing included
  - 😎 Preload (context bridge) already configured
  - 🙀 IPC communication example included
  - 🔮 GitHub Action releases with `Windows`, `Mac` and `Linux` binaries
  - 🔒 Source Code Protection support
  - 🍪 Absolute paths support
- **Technologies**:
  - 🔋 Electron
  - 🔥 ReactJS
  - 🌎 React Router DOM and Electron Router DOM
  - 🧐 React Developer Tools
  - 💙 TypeScript
  - 📦 Electron Vite
  - ✨ CSS / SASS modules
  - 💫 Eslint / Prettier / EditorConfig / Husky / lint-staged / Commitlint
  - 📦 Electron Builder
  - 🔮 action-electron-builder

# <img src="./docs/images/bullet.svg" width="19" /> Usage

First, install the dependencies by running on the terminal:

```
yarn
```

That done, just run the project with the following command:

```
yarn dev
```

Now, look at the **package.json** file in the root directory, you should update some of that settings with your project branding.

# <img src="./docs/images/bullet.svg" width="14" /> Distribution

### For all platforms

> **Note**: Check [Electron Builder docs](https://www.electron.build/cli) for more knowledge

```
yarn build
```

### For a specific one

```bash
yarn build --mac
# OR
yarn build --win
# OR
yarn build --linux
```

The builded apps will be available on the `dist` folder.

# <img src="./docs/images/bullet.svg" width="14" /> Releasing
> **Note**: to be able to perform `auto-updates` you will need a `code signed app`, for this purpose you will need to configure it by yourself, so check the [electron-builder](https://www.electron.build/code-signing) and [action-electron-builder](https://github.com/samuelmeuli/action-electron-builder#code-signing) docs please to get know how to do this.

To release your app on a GitHub release with `Windows`, `Mac` and `Linux` binaries, you can perform the following commands:

```bash
git pull
yarn make:release
```

Then, enter the new version of your app, so it will produce the following binaries in a draft release from the action:
  - `Windows` &#8594; `zip (portable)`, `.exe`
  - `Mac` &#8594; `.zip (app)`, `.dmg`
  - `Linux` &#8594; `AppImage`, `freebsd`, `pacman`, `rpm`, `deb`



# <img src="./docs/images/bullet.svg" width="14" /> Source Code Protection
> This process is done via [v8 bytecode compilation](https://nodejs.org/api/vm.html#vm_script_createcacheddata), to get more knowledge about it, please, [check the Electron Vite docs](https://evite.netlify.app/guide/source-code-protection.html).

Use the `bytecodePlugin` from `electron-vite` to enable it in the **electron.vite.config.ts**:

```ts
import { defineConfig, bytecodePlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [tsconfigPaths, bytecodePlugin()]
  },

  preload: {
    // Note: you will get the following warning using bytecodePlugin in the preload script in production build: "The vm module of Node.js is deprecated in the renderer process and will be removed", is up to you to keep bytecodePlugin here. Also, keep following the Electron Vite docs for more updates about this plugin!
    plugins: [tsconfigPaths, bytecodePlugin()]
  },

  renderer: {
    // ...
  }
})
```
Also, `sandbox` should be `false` in `webPreferences` for the windows you are using a preload script like:
```ts
const window = createWindow({
  id: 'main',

  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: false,
  },
})
```

# <img src="./docs/images/bullet.svg" width="19" /> Documents
<table >
  <tr>
    <td valign="bottom">
      <p align="center">
        <a href="./docs/CREATING_WINDOWS.md">
          <img src="./docs/images/creating-windows.svg" height="96" align="center" />
        </a>
        <br/><br/>
        <a href="./docs/CREATING_WINDOWS.md">Creating Windows</a>
      </p>
    </td>
    <td valign="bottom">
      <p align="center">
        <a href="./docs/ROUTING.md">
          <img src="./docs/images/routing.svg" height="96" align="center" />
        </a>
        <br/><br/>
        <a href="./docs/ROUTING.md">Routing</a>
      </p>
    </td>
    <td valign="bottom">
      <p align="center">
        <a href="./docs/STRUCTURE.md">
          <img src="./docs/images/understanding.svg" height="96" align="center" />
        </a>
        <br/><br/>
        <a href="./docs/STRUCTURE.md">Structure Overview</a>
      </p>
    </td>
    <td valign="bottom">
      <p align="center">
        <a href="./docs/FAQ.md">
          <img src="./docs/images/faq.svg" height="96" align="center" />
        </a>
        <br/><br/>
        <a href="./docs/FAQ.md">FAQ - Frequently Asked Questions</a>
      </p>
    </td>
  </tr>
</table>

# Contributing
> **Note**: contributions are always welcome, but always **ask first**, — please — before work on a PR.

That said, there's a bunch of ways you can contribute to this project, like by:

- :beetle: Reporting a bug
- :page_facing_up: Improving this documentation
- :rotating_light: Sharing this project and recommending it to your friends
- :dollar: Supporting this project on GitHub Sponsors or Patreon
- :star2: Giving a star on this repository

# License

[MIT © Dalton Menezes](https://github.com/daltonmenezes/electron-app/blob/main/LICENSE)
