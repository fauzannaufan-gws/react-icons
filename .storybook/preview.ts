import { INITIAL_VIEWPORTS } from "storybook/viewport";
import pretty from "pretty";

export const parameters = {
    viewport: {
        options: INITIAL_VIEWPORTS,
    },
    layout: "centered",
    controls: {
        expanded: true,
    },
    docs: {
        transformSource: (input: string) => pretty(input),
    },
    options: {
        storySort: {
            order: ["Usage", "Collection"],
        },
    },
};
