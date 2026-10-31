// Morandi's paper and ink palette, adapted to DSH's actual semantic tokens.
// DSH owns mode and user font settings; heading size follows its font delta.
window.__ModuleLoader__.load({
  id: '@xwtaidev/dsh-theme-morandi',
  factory() {
    // Fall back to the source's serif style only when the user has not set a text font.
    const heading = 'var(--dsh-font-family-text, "Iowan Old Style", "Palatino Linotype", Palatino, "Songti SC", "Noto Serif SC", "Source Han Serif SC", Georgia, serif)';
    const same = (value) => ({ light: value, dark: value });
    const tokens = {
      // Surfaces and conversation chrome
      '--dsw-alias-bg-base': { light: '#f5f1e8', dark: '#262220' },
      '--dsw-alias-bg-layer-1': { light: '#f8f4ec', dark: '#2d2825' },
      '--dsw-alias-bg-layer-2': { light: '#efeae2', dark: '#35302b' },
      '--dsw-alias-bg-layer-3': { light: '#eae4d9', dark: '#403a34' },
      '--dsw-alias-bg-overlay': { light: '#f8f4ec', dark: '#403a34' },
      '--dsw-alias-bg-module-platform': { light: '#efe9de', dark: '#35302b' },
      '--dsw-alias-bg-multi-select': { light: '#eae4d9', dark: '#35302b' },
      '--dsw-alias-bg-document-preview': { light: '#efeae2', dark: '#2d2825' },
      '--dsw-alias-label-document-preview': { light: '#4e463e', dark: '#d9d2c8' },
      '--dsw-alias-bg-document-selection': { light: '#b5a79a66', dark: '#aab5be66' },
      '--dsw-alias-bg-skeleton': { light: '#342f2b14', dark: '#efeae21f' },
      '--dsw-specific-sidebar-fill': { light: '#eae4d9', dark: '#1f1c1a' },
      '--dsw-specific-sidebar-nav-item-active': { light: '#ded6c8', dark: '#403a34' },
      '--dsw-specific-sidebar-nav-item-active-accent': { light: '#e2d5c8', dark: '#40464a' },
      '--dsw-specific-sidebar-nav-item-hover': { light: '#e4ddcf', dark: '#35302b' },
      '--dsw-specific-bubble': { light: '#eee5d9', dark: '#35302b' },
      '--dsw-specific-bubble-highlight': { light: '#e3d4c6', dark: '#464d50' },
      '--dsw-specific-input-major': { light: '#faf7f0', dark: '#302b27' },
      '--dsw-specific-login-input': { light: '#f8f4ec', dark: '#2d2825' },
      '--dsw-specific-selector': { light: '#efe9de', dark: '#35302b' },
      '--dsw-specific-tip': { light: '#efe9de', dark: '#35302b' },
      '--dsw-specific-menu': { light: '#f8f4ec', dark: '#403a34' },
      '--dsw-alias-menu-group-header-fill': { light: '#f8f4ec', dark: '#403a34' },
      // Borders, text, and subdued labels
      '--dsw-alias-border-l1': { light: '#e4ddcf', dark: '#403a34' },
      '--dsw-alias-border-l2': { light: '#d8d0c1', dark: '#504940' },
      '--dsw-alias-border-l2-darkmode-thin': { light: '#d8d0c1', dark: '#504940' },
      '--dsw-alias-border-l3': { light: '#cfc6b6', dark: '#60574f' },
      '--dsw-alias-border-l4': { light: '#bcb2a3', dark: '#746a61' },
      '--dsw-alias-label-primary': { light: '#342f2b', dark: '#efeae2' },
      '--dsw-alias-label-primary-dimmed': { light: '#4e463e', dark: '#d9d2c8' },
      '--dsw-alias-label-primary-bluish': { light: '#384248', dark: '#e2e6e5' },
      '--dsw-alias-label-primary-inverted': { light: '#f8f4ec', dark: '#262220' },
      '--dsw-alias-label-primary-foreground': { light: '#f8f4ec', dark: '#262220' },
      '--dsw-alias-label-secondary': { light: '#625852', dark: '#c5bcb0' },
      '--dsw-alias-label-tertiary': { light: '#6d625d', dark: '#b5ada3' },
      '--dsw-alias-label-caption': { light: '#756b63', dark: '#a59e95' },
      '--dsw-alias-label-dimmed': { light: '#a59e95', dark: '#746a61' },
      '--dsw-alias-menu-icon': { light: '#4e463e', dark: '#d9d2c8' },
      // Contrasting inverted foregrounds pair with the primary button fill.
      '--dsw-alias-brand-primary': { light: '#5b473c', dark: '#c4ced1' },
      '--dsw-alias-brand-primary-invert': { light: '#5b473c', dark: '#c4ced1' },
      '--dsw-alias-brand-text': { light: '#5b473c', dark: '#c4ced1' },
      '--dsw-alias-button-primary-fill': { light: '#5b473c', dark: '#c4ced1' },
      '--dsw-alias-button-primary-hover': { light: '#49382f', dark: '#aab5be' },
      '--dsw-alias-button-primary-dimmed': { light: '#e4ddcf', dark: '#504940' },
      '--dsw-alias-button-contrast-fill': { light: '#5b473c', dark: '#c4ced1' },
      '--dsw-alias-button-elevated-fill': { light: '#f8f4ec', dark: '#403a34' },
      '--dsw-alias-button-floating-fill': { light: '#f8f4ec', dark: '#35302b' },
      '--dsw-alias-button-floating-hover': { light: '#eae4d9', dark: '#403a34' },
      '--dsw-alias-button-ghost-active-border': { light: '#a99b8d', dark: '#8c98a0' },
      '--dsw-alias-button-ghost-active-fill': { light: '#eae4d9', dark: '#403a34' },
      '--dsw-alias-button-ghost-active-hover': { light: '#ded6c8', dark: '#504940' },
      '--dsw-alias-interactive-bg-hover': { light: '#342f2b0e', dark: '#efeae214' },
      '--dsw-alias-interactive-bg-hover-solid': { light: '#eae4d9', dark: '#403a34' },
      '--dsw-alias-interactive-bg-hover-accent': { light: '#7a615326', dark: '#aab5be30' },
      '--dsw-alias-interactive-bg-hover-danger': { light: '#9c4f4518', dark: '#c9847830' },
      '--dsw-alias-interactive-bg-active': { light: '#7a615326', dark: '#aab5be30' },
      '--dsw-alias-link': { light: '#705348', dark: '#b8c7d0' },
      '--dsw-alias-state-business-primary': { light: '#705348', dark: '#b8c7d0' },
      '--dsw-alias-state-business-tertiary': { light: '#e6d8cb', dark: '#40464a' },
      // Meaningful status colors stay distinguishable and readable.
      '--dsw-alias-state-error-primary': { light: '#96483f', dark: '#d99588' },
      '--dsw-alias-state-error-secondary': { light: '#a9574d', dark: '#c98478' },
      '--dsw-alias-state-success-primary': { light: '#526a4c', dark: '#a3b79a' },
      '--dsw-alias-state-success-secondary': { light: '#607755', dark: '#a3b79a' },
      '--dsw-alias-state-success-tertiary': { light: '#e2eadc', dark: '#303d30' },
      '--dsw-alias-state-warn-label': { light: '#805328', dark: '#e0b58b' },
      '--dsw-alias-state-warn-primary': { light: '#805328', dark: '#e0b58b' },
      '--dsw-alias-state-warn-secondary': { light: '#976130', dark: '#d2a074' },
      '--dsw-alias-state-warn-tertiary': { light: '#efe3d1', dark: '#47392c' },
      '--dsw-alias-state-idle-primary': { light: '#a59e95', dark: '#746a61' },
      // Markdown, diff, scrollbars, and floating feedback.
      '--dsw-alias-markdown-citation': { light: '#eae4d9', dark: '#403a34' },
      '--dsw-alias-markdown-code-block': { light: '#efeae2', dark: '#211d1b' },
      '--dsw-alias-markdown-code-block-banner': { light: '#eae4d9', dark: '#302b27' },
      '--dsw-alias-markdown-code-segment-selected': { light: '#faf7f0', dark: '#403a34' },
      '--dsw-alias-markdown-code-segment-unselected': { light: '#eae4d9', dark: '#262220' },
      '--dsw-alias-markdown-inline-code': { light: '#eee7dc', dark: '#403a34' },
      '--dsw-alias-markdown-placeholder': { light: '#efe9de', dark: '#35302b' },
      '--dsw-alias-markdown-tag': { light: '#eae4d9', dark: '#403a34' },
      '--dsw-alias-code-diff-added': { light: '#5c71561f', dark: '#a3b79a26' },
      '--dsw-alias-code-diff-deleted': { light: '#9c4f451f', dark: '#c9847826' },
      '--dsw-alias-file-diff-added-bg': { light: '#e2eadc', dark: '#303d30' },
      '--dsw-alias-file-diff-added-gutter': { light: '#ebf0e7', dark: '#283328' },
      '--dsw-alias-file-diff-added-marker': { light: '#526a4c', dark: '#a3b79a' },
      '--dsw-alias-file-diff-deleted-bg': { light: '#f0e0da', dark: '#49332f' },
      '--dsw-alias-file-diff-deleted-gutter': { light: '#f6eae4', dark: '#392a27' },
      '--dsw-alias-file-diff-deleted-marker': { light: '#96483f', dark: '#d99588' },
      '--dsw-alias-scrollbar-bg-l1': { light: '#cfc6b6', dark: '#60574f' },
      '--dsw-alias-scrollbar-bg-l2': { light: '#c5baaa', dark: '#746a61' },
      '--dsw-alias-scrollbar-hover-l1': { light: '#b5ada3', dark: '#8a8078' },
      '--dsw-alias-scrollbar-hover-l2': { light: '#a59e95', dark: '#a59e95' },
      '--dsw-alias-toast-bg': { light: '#4e463e', dark: '#504940' },
      '--dsw-alias-toast-label': { light: '#f8f4ec', dark: '#f8f4ec' },
      '--dsw-alias-tooltip-bg': { light: '#4e463e', dark: '#504940' },
      // Full host shorthands, retaining DSH's adjustable content-size delta.
      '--dsw-font-markdown-h1': same(`700 calc(21px + var(--dsh-content-font-delta)) / calc(30px + var(--dsh-content-font-delta)) ${heading}`),
      '--dsw-font-markdown-h2': same(`700 calc(19px + var(--dsh-content-font-delta)) / calc(28px + var(--dsh-content-font-delta)) ${heading}`),
      '--dsw-font-markdown-h3': same(`700 calc(18px + var(--dsh-content-font-delta)) / calc(26px + var(--dsh-content-font-delta)) ${heading}`)
    };

    return {
      inject: ['theme'],
      apply(ctx) {
        ctx.effect(
          () => ctx.theme.overrideTokens('@xwtaidev/dsh-theme-morandi', tokens),
          'morandi: semantic theme tokens'
        );
      }
    };
  }
});
