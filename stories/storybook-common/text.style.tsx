import React from "react";
import styled from "styled-components";
import { Colors } from "./style-specs/color";
import { LinkIcon } from "./link-icon";

interface HeadingProps {
    children: string;
}

// =============================================================================
// HOC
// =============================================================================
const withLink =
    (Component: React.ComponentType<React.HTMLAttributes<HTMLElement>>) =>
    // eslint-disable-next-line react/display-name
    ({ children }: HeadingProps): JSX.Element => {
        const linkId = convertToLinkId(children);

        return (
            <Component id={linkId}>
                <Link
                    aria-hidden="true"
                    href={`#${linkId}`}
                    tabIndex={-1}
                    target="_self"
                >
                    <LinkIcon />
                </Link>
                {children}
            </Component>
        );
    };

// =============================================================================
// STYLING
// =============================================================================
const Link = styled.a`
    opacity: 0;
    font-weight: normal;
    font-size: 1.5rem;
    margin-left: -1.5rem;
    padding-right: 0.5rem;
    color: ${Colors.Neutral[4]};
    cursor: pointer;

    svg {
        vertical-align: baseline;
        height: 1rem;
        width: 1rem;
    }

    &:hover {
        color: ${Colors.Neutral[4]};
    }
`;

const StyledTitle = styled.h1`
    font-family: "Open Sans Bold";
    font-weight: bold;
    font-size: 3rem;
    line-height: 4rem;
    letter-spacing: -0.056rem;
    margin: 0 0 3rem;

    &:hover {
        ${Link} {
            opacity: 1;
        }
    }
`;

const StyledSecondary = styled.h1`
    font-family: "Open Sans Bold";
    font-weight: bold;
    font-size: 2rem;
    line-height: 2.5rem;
    margin: 1rem 0 1.5rem;
    &:hover {
        ${Link} {
            opacity: 1;
        }
    }
`;

const StyledTertiary = styled.h2`
    font-family: "Open Sans Semibold";
    font-size: 1.625rem;
    line-height: 2.25rem;
    margin: 1rem 0 1.5rem;
    &:hover {
        ${Link} {
            opacity: 1;
        }
    }
`;

const StyledQuaternary = styled.h4`
    font-family: "Open Sans Bold";
    font-size: 1.125rem;
    line-height: 1.625rem;
    margin: 1.5rem 0;
    &:hover {
        ${Link} {
            opacity: 1;
        }
    }
`;

// =============================================================================
// EXPORTABLES
// =============================================================================

export const Title = withLink(StyledTitle);
export const Secondary = withLink(StyledSecondary);
export const Heading3 = withLink(StyledTertiary);
export const Heading4 = withLink(StyledQuaternary);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
const convertToLinkId = (value: string): string => {
    return value.toLowerCase().replace(" ", "-");
};
