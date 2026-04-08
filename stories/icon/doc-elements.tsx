import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { CopyIcon } from "../../src/copy";
import { Colors } from "../storybook-common/style-specs/color";
import { ICONS } from "./data";

// =============================================================================
// ICON SET
// =============================================================================
export const IconSet = () => {
    const [selectedDisplayName, _setSelected] = useState<string | undefined>(
        undefined
    );
    const [currentCopied, setCopied] = useState<"import" | "usage" | undefined>(
        undefined
    );

    const toastRef = useRef<HTMLDivElement>(null);
    const selectedDisplayNameRef = useRef<string | undefined>(
        selectedDisplayName
    );

    // =============================================================================
    // REF FUNCTIONS
    // =============================================================================
    const setSelected = (value: string | undefined) => {
        selectedDisplayNameRef.current = value;
        _setSelected(value);
    };

    // =========================================================================
    // EFFECTS
    // =========================================================================
    useEffect(() => {
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (currentCopied) {
            setTimeout(() => {
                setCopied(undefined);
            }, 2000);
        }
    }, [currentCopied]);

    // =========================================================================
    // EVENT HANDLERS
    // =========================================================================
    const handleLinkClick =
        (displayName: string) => (event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            setSelected(displayName);
        };

    const handleMouseDown = (event: MouseEvent) => {
        if (shouldDismissToast(event)) {
            setSelected(undefined);
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (shouldDismissToast(event)) {
            setSelected(undefined);
        }
    };

    const handleScroll = (event: Event) => {
        setSelected(undefined);
    };

    const handleCopyImportButtonClick =
        (importStatement: string) =>
        (event: React.MouseEvent<HTMLButtonElement>) => {
            navigator.clipboard.writeText(importStatement);
            setCopied("import");
        };

    const handleCopyComponentNameButtonClick =
        (componentName: string) =>
        (event: React.MouseEvent<HTMLButtonElement>) => {
            navigator.clipboard.writeText(`<${componentName} />`);
            setCopied("usage");
        };

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================
    const shouldDismissToast = (event: MouseEvent | KeyboardEvent) => {
        return !(
            toastRef.current && (toastRef.current as any).contains(event.target)
        );
    };

    // =========================================================================
    // RENDER FUNCTIONS
    // =========================================================================

    const renderIcons = () => {
        return ICONS.map((icon, index) => {
            return (
                <Item key={index}>
                    <Clickable
                        tabIndex={0}
                        onClick={handleLinkClick(icon.type.displayName)}
                        selected={icon.type.displayName === selectedDisplayName}
                    >
                        {icon}
                    </Clickable>
                    <LabelLink>{icon.type.displayName}</LabelLink>
                </Item>
            );
        });
    };

    const renderSnippetToast = (selectedDisplayName: string) => {
        const componentFileName = selectedDisplayName
            // split words e.g. A-B and a-B
            .replace(/([A-Za-z0-9])([A-Z])/g, "$1-$2")
            // split alphanumeric groups e.g. -2x2-
            .replace(/([A-Za-z])([0-9])([^-]+)?/g, "$1-$2$3")
            .toLowerCase()
            .replace("-icon", "");

        const importStatement = `import { ${selectedDisplayName} } from "@lifesg/react-icons/${componentFileName}";`;

        return (
            <Toast ref={toastRef}>
                Import
                <ToastSubtitle>
                    Add this import statement at the top of your component file
                </ToastSubtitle>
                <CodeSnippet>
                    <code>{importStatement}</code>
                    <CopyButton
                        type="button"
                        onClick={handleCopyImportButtonClick(importStatement)}
                    >
                        <CopyIcon />
                        {currentCopied === "import" && (
                            <FeedbackTooltip>
                                Copied to clipboard
                            </FeedbackTooltip>
                        )}
                    </CopyButton>
                </CodeSnippet>
                Usage
                <ToastSubtitle>
                    You can pass additional props to the component if required
                </ToastSubtitle>
                <CodeSnippet>
                    <code>{`<${selectedDisplayName} />`}</code>
                    <CopyButton
                        type="button"
                        onClick={handleCopyComponentNameButtonClick(
                            selectedDisplayName
                        )}
                    >
                        <CopyIcon />
                        {currentCopied === "usage" && (
                            <FeedbackTooltip>
                                Copied to clipboard
                            </FeedbackTooltip>
                        )}
                    </CopyButton>
                </CodeSnippet>
            </Toast>
        );
    };

    return (
        <>
            <Wrapper>
                <Set>{renderIcons()}</Set>
            </Wrapper>
            {selectedDisplayName && renderSnippetToast(selectedDisplayName)}
        </>
    );
};

// =============================================================================
// STYLING
// =============================================================================
const Wrapper = styled.div`
    position: relative;
`;

const Set = styled.ul`
    display: flex;
    flex-wrap: wrap;
    position: relative;
`;

const Item = styled.li`
    display: flex;
    flex-direction: column;
    width: calc(100% / 4);
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;

    @media screen and (max-width: 1199px) {
        width: calc(100% / 3);
    }

    @media screen and (max-width: 480px) {
        width: calc(100% / 2);
    }
`;

interface ClickableStyleProps {
    selected?: boolean;
}

const Clickable = styled.div<ClickableStyleProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 5rem;
    width: 5rem;
    border-radius: 4px;
    cursor: pointer;

    svg {
        transition: all ease-in-out 300ms;
        height: 1.5rem;
        width: 1.5rem;
    }

    &:hover {
        background: ${Colors.Neutral[7]};
        svg {
            height: 2rem;
            width: 2rem;
        }
    }

    ${(props) => {
        if (props.selected) {
            return css`
                background: ${Colors.Neutral[7]};
                svg {
                    height: 2rem;
                    width: 2rem;
                }
            `;
        }
    }}
`;

const LabelLink = styled.span`
    font-family: "Open Sans";
    font-size: 0.9rem !important;
    margin-bottom: 0;
`;

const Toast = styled.div`
    position: fixed;
    width: fit-content;
    height: fit-content;
    top: 100px;
    left: 0;
    right: 0;
    margin: auto;
    background: ${Colors.Neutral[5]};
    color: ${Colors.Neutral[1]};
    font-family: "Open Sans Semibold";
    font-size: 0.9rem !important;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.4) 0 1px 3px 0;
    display: flex;
    flex-direction: column;
`;

const ToastSubtitle = styled.span`
    font-family: "Open Sans";
    font-size: 0.9rem !important;
    color: ${Colors.Neutral[3]};
`;

const FeedbackTooltip = styled.div`
    position: absolute;
    bottom: -2rem;
    height: max-content;
    width: max-content;
    padding: 0.5rem;
    left: calc(-100% - 1rem);
    border-radius: 4px;
    margin: auto;
    font-family: "Open Sans";
    font-size: 0.75rem !important;
    color: ${Colors.Neutral[8]};
    background: rgba(0, 0, 0, 0.8);
`;

const CodeSnippet = styled.div`
    background-color: ${Colors.Neutral[8]};
    display: flex;
    width: max-content;
    align-items: center;
    margin: 0.5rem 0;
    border-radius: 4px;

    code {
        color: ${Colors.Neutral[1]};
        background: transparent;
    }
`;

const CopyButton = styled.button`
    padding: 0.5rem;
    border: none;
    cursor: pointer;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    background: ${Colors.Neutral[4]};
    position: relative;

    svg {
        color: ${Colors.Neutral[8]};
    }

    &:hover {
        background: ${Colors.Neutral[3]};
    }
`;
