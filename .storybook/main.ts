import { fileURLToPath } from "node:url";
import { StorybookConfig } from "@storybook/react-webpack5";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
    stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
    addons: ["@storybook/addon-webpack5-compiler-swc", "@storybook/addon-docs"],
    staticDirs: ["../public"],
    typescript: {
        reactDocgen: "react-docgen-typescript",
    },
    webpackFinal: async (config) => {
        config.resolve!.modules = [
            path.resolve(__dirname, ".."),
            "node_modules",
        ];
        return config;
    },
    features: { sidebarOnboardingChecklist: false },
    framework: {
        name: "@storybook/react-webpack5",
        options: {},
    },
    swc: () => ({
        jsc: {
            transform: {
                react: {
                    runtime: "automatic",
                },
            },
        },
    }),
};
export default config;
