# Morandi for DeepSeek Harness v1.0.0

The first release of Morandi for the DeepSeek Harness Web client brings the quiet, low-saturation paper-and-ink palette of the original Obsidian theme to the DSH interface. This is a theme-token adaptation, not a direct port of the Obsidian stylesheet.

## Highlights

- **Light mode — paper:** warm paper backgrounds (`#f5f1e8`), deep brown text (`#342f2b`), and muted earthy accents.
- **Dark mode — ink:** warm, near-black surfaces (`#262220`), mist-white text (`#efeae2`), and cool blue-gray accents.
- **DSH-wide semantic palette:** colors for surfaces, navigation, conversation elements, text, controls, links, statuses, Markdown, code blocks, file diffs, scrollbars, and feedback surfaces where the host consumes the overridden tokens.
- **Reading-oriented typography:** Markdown H1–H3 follow DSH's text-size adjustment. They use the configured DSH text font when present and otherwise fall back to locally available serif fonts.
- **Two matching color modes:** the theme follows DSH's Light, Dark, or System appearance setting; it does not add a separate item to the built-in appearance selector.
- **No build or theme runtime dependencies:** the bundle includes a ready-to-load client. The theme code does not download fonts or other assets, read credentials, or initiate network requests. DSH and its installer may have their own network and profile requirements.

## Installation and use

In DeepSeek Harness, open **Plugins → Add Plugin → Install Third-party Plugin** and select the project directory or provide its [GitHub repository](https://github.com/xwtaidev/dsh-morandi-theme). For a reproducible installation, review and pin the full Git commit for this release. Confirm and enable the bundle, then select Light, Dark, or System under the appearance settings. Follow the installer's status and warnings; an update may require a restart.

The package name is `@xwtaidev/dsh-theme-morandi`. An npm installation by name is available only after the package has actually been published to npm. A GitHub release does not automatically publish an npm package or list it in a third-party market.

## Migrating from the local development package

The earlier development package was named `@local/dsh-morandi-theme`. The new name represents a different package identity rather than an automatic in-place upgrade. Back up your DSH profile, disable and uninstall the old package, install the new one, check that the old entry is gone, and retest the final installation. Avoid keeping both versions active.

## Theme behavior and compatibility

- Disable or remove the bundle to release its token override layer and reveal the underlying theme values.
- Multiple enabled theme layers are composed per token in registration order. Later overrides win where they overlap, while non-overlapping overrides remain. Enable only one theme for predictable results.
- Components using independent, locally redefined, or hard-coded colors may not adopt every palette value; DSH keeps control of its layout and functionality.
- A DSH build providing the compatible `ctx.theme.overrideTokens` client service is required. An independently verified DSH, operating-system, and Node compatibility range has not yet been documented.

## Validation

The maintainer reports manually testing a local development version in DSH. The precise configuration and coverage have not been independently documented; in particular, the final package identity should be reinstalled and retested after the rename.

Automated tests exercise the client module with simulated DSH theme/effect services, both color modes, layer cleanup and composition, manifest resources, typography tokens, and representative color contrasts. These tests are not a substitute for real-host integration testing or a complete accessibility audit.

## Attribution and license

Adapted from [Obsidian Morandi](https://github.com/xwtaidev/obsidian-morandi-theme) by xwtaidev. Copyright © 2026 xwtaidev. Released under the [MIT License](https://github.com/xwtaidev/dsh-morandi-theme/blob/main/LICENSE).
