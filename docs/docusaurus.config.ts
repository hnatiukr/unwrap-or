import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { themes as prismThemes } from "prism-react-renderer";

import * as lib from "../package.json";

const config: Config = {
  title: lib.name,
  tagline: lib.description,
  projectName: lib.name,
  organizationName: lib.author.name,

  favicon: "img/logo.svg",

  trailingSlash: false,
  baseUrl: "/unwrap-or",
  url: lib.homepage.slice(0, -11),
  deploymentBranch: "gh-pages",

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "uk"],
  },

  presets: [
    [
      "classic",

      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl: `${lib.repository.url}/docs`,
        },
        theme: {
          customCss: ["./src/custom.css"],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: lib.name,
      logo: {
        alt: lib.name,
        src: "img/logo.svg",
      },
      items: [
        {
          position: "right",
          label: `v${lib.version}`,
          href: `${lib.repository.url}/releases/tag/v${lib.version}`,
        },
        // {
        //   type: "docsVersionDropdown",
        //   position: "right",
        // },
        // {
        //   type: "localeDropdown",
        //   position: "right",
        // },
        {
          href: lib.repository.url,
          label: "GitHub",
          position: "right",
        },
      ],
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ["bash"],
    },

    // announcementBar: {
    //   id: `announcementBar-v${lib.version}`,
    //   content: `<b><a target="_blank" href="${lib.repository.url}releases/tag/v${lib.version}">${lib.name} v${lib.version}</a> is out!</b>`,
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;
