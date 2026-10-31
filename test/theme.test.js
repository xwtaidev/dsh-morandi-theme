import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import vm from 'node:vm';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (name) => readFileSync(join(root, name), 'utf8');
const manifest = JSON.parse(read('package.json'));
const client = read('client.js');

// A minimal but stateful model of ThemeRuntime: layers compose by sequence,
// same-source re-registration supersedes the old disposer, and system chooses
// the effective scheme. Font preferences are independent of token overrides.
function makeTheme() {
  let preference = 'system';
  let system = 'light';
  let sequence = 0;
  const layers = new Map();
  const base = { '--dsw-alias-bg-base': { light: '#ffffff', dark: '#111111' }, '--other': { light: 'L', dark: 'D' } };
  const fonts = { text: 'User Sans', code: 'User Mono', terminal: 'User Terminal', size: 17 };
  return {
    fonts,
    setPreference(value) { preference = value; },
    setSystem(value) { system = value; },
    overrideTokens(source, pairs) {
      assert.equal(typeof source, 'string');
      const copy = {};
      for (const [name, pair] of Object.entries(pairs)) {
        assert.equal(typeof pair.light, 'string');
        assert.equal(typeof pair.dark, 'string');
        copy[name] = { light: pair.light, dark: pair.dark };
      }
      const layer = { seq: sequence++, pairs: copy };
      layers.set(source, layer);
      return () => { if (layers.get(source) === layer) layers.delete(source); };
    },
    snapshot() {
      const mode = preference === 'system' ? system : preference;
      const output = Object.fromEntries(Object.entries(base).map(([key, value]) => [key, value[mode]]));
      for (const layer of [...layers.values()].sort((a, b) => a.seq - b.seq)) {
        for (const [key, pair] of Object.entries(layer.pairs)) output[key] = pair[mode];
      }
      return output;
    },
    get layers() { return layers; }
  };
}

function loadPlugin() {
  const calls = [];
  const window = { __ModuleLoader__: { load(spec) { calls.push(spec); } } };
  vm.runInNewContext(client, { window }, { filename: 'client.js', timeout: 1000 });
  assert.equal(calls.length, 1);
  return calls[0];
}
function activate(plugin, theme) {
  const disposers = [];
  const ctx = {
    theme,
    effect(register) {
      const dispose = register();
      assert.equal(typeof dispose, 'function', 'effect owns the override disposer');
      disposers.push(dispose);
    }
  };
  plugin.apply(ctx);
  return () => { for (const dispose of disposers.reverse()) dispose(); };
}

function luminance(hex) {
  assert.match(hex, /^#[0-9a-f]{6}$/i);
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = channels.map((x) => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
function contrast(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

test('manifest, exports, locales, bundle patch, and JavaScript syntax', () => {
  assert.equal(manifest.name, '@local/dsh-morandi-theme');
  assert.equal(manifest.type, 'module');
  assert.equal(manifest.license, 'MIT');
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml');
  assert.deepEqual(manifest.dsh.client, { platform: 'web', immediately: true, inject: ['@deepseek-ai/dsh-client-ui-theme'] });
  assert.equal(manifest.exports['.'], './index.js');
  assert.equal(manifest.exports['./client'], './client.js');
  assert.equal(manifest.exports['./icon'], './icon.svg');
  assert.equal(manifest.exports['./locale/*.json'], './locale/*.json');
  for (const file of ['index.js', 'client.js', 'cordis.patch.yml', 'icon.svg', 'LICENSE', 'README.md']) {
    assert.ok(existsSync(join(root, file)), file);
    assert.ok(manifest.files.includes(file), file);
  }
  assert.ok(manifest.files.includes('locale/*.json'));
  assert.match(read('cordis.patch.yml'), /^- insert:\s*\n\s+- id: dsh-morandi-theme\s*\n\s+name: '@local\/dsh-morandi-theme'\s*$/);
  for (const lang of ['en', 'zh']) {
    const { meta } = JSON.parse(read(`locale/${lang}.json`));
    assert.ok(meta.title && meta.description);
  }
  assert.match(read('icon.svg'), /<svg\s[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(read('LICENSE'), /Copyright \(c\) 2026 xwtaidev/);
  for (const file of ['index.js', 'client.js']) {
    const result = spawnSync(process.execPath, ['--check', join(root, file)], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  }
});

test('factory registers only on apply and supplies light/dark token pairs', () => {
  const spec = loadPlugin();
  assert.equal(spec.id, manifest.name);
  const plugin = spec.factory();
  assert.deepEqual(Array.from(plugin.inject), ['theme']);
  const theme = makeTheme();
  assert.equal(theme.layers.size, 0);
  const stop = activate(plugin, theme);
  assert.equal(theme.layers.size, 1);
  const layer = theme.layers.get(manifest.name);
  assert.ok(layer);
  assert.ok(Object.keys(layer.pairs).length >= 75);
  for (const [name, pair] of Object.entries(layer.pairs)) {
    assert.match(name, /^--dsw-(?:(?:alias|specific)-|font-markdown-h[123]$)/);
    assert.ok(pair.light && pair.dark);
  }
  assert.deepEqual(Object.keys(layer.pairs).filter((name) => /font/.test(name)).sort(), [
    '--dsw-font-markdown-h1', '--dsw-font-markdown-h2', '--dsw-font-markdown-h3'
  ]);
  for (const heading of ['h1', 'h2', 'h3']) {
    const pair = layer.pairs[`--dsw-font-markdown-${heading}`];
    assert.equal(pair.light, pair.dark);
    assert.match(pair.light, /var\(--dsh-content-font-delta\)/);
    assert.match(pair.light, /var\(--dsh-font-family-text, .*serif\)/);
  }
  stop();
  assert.equal(theme.layers.size, 0);
});

test('system, explicit modes, and font preferences survive activation and disposal', () => {
  const theme = makeTheme();
  const initialFonts = { ...theme.fonts };
  const initial = theme.snapshot();
  const stop = activate(loadPlugin().factory(), theme);
  assert.equal(theme.snapshot()['--dsw-alias-bg-base'], '#f5f1e8');
  assert.equal(theme.snapshot()['--dsw-alias-label-primary'], '#342f2b');
  theme.setSystem('dark');
  assert.equal(theme.snapshot()['--dsw-alias-bg-base'], '#262220');
  assert.equal(theme.snapshot()['--dsw-alias-label-primary'], '#efeae2');
  theme.setPreference('light');
  assert.equal(theme.snapshot()['--dsw-alias-bg-base'], '#f5f1e8');
  theme.setPreference('dark');
  theme.setSystem('light');
  assert.equal(theme.snapshot()['--dsw-alias-bg-base'], '#262220');
  assert.deepEqual(theme.fonts, initialFonts);
  stop();
  stop();
  assert.equal(theme.snapshot()['--dsw-alias-bg-base'], '#111111');
  theme.setPreference('system');
  assert.deepEqual(theme.snapshot(), initial);
  assert.deepEqual(theme.fonts, initialFonts);
});

test('layers compose in registration order and disposal restores the layer below', () => {
  const theme = makeTheme();
  const below = theme.overrideTokens('another-theme', { '--dsw-alias-bg-base': { light: '#abcabc', dark: '#123123' }, '--other': { light: 'other-L', dark: 'other-D' } });
  const stop = activate(loadPlugin().factory(), theme);
  assert.equal(theme.snapshot()['--dsw-alias-bg-base'], '#f5f1e8');
  assert.equal(theme.snapshot()['--other'], 'other-L');
  const above = theme.overrideTokens('last-theme', { '--dsw-alias-bg-base': { light: '#010203', dark: '#040506' } });
  assert.equal(theme.snapshot()['--dsw-alias-bg-base'], '#010203');
  above();
  assert.equal(theme.snapshot()['--dsw-alias-bg-base'], '#f5f1e8');
  stop();
  assert.equal(theme.snapshot()['--dsw-alias-bg-base'], '#abcabc');
  below();
  assert.equal(theme.snapshot()['--dsw-alias-bg-base'], '#ffffff');
});

test('representative foreground, link, statuses, and primary controls reach 4.5:1', () => {
  const theme = makeTheme();
  activate(loadPlugin().factory(), theme);
  for (const mode of ['light', 'dark']) {
    theme.setPreference(mode);
    const t = theme.snapshot();
    const pairs = [
      ['--dsw-alias-label-primary', '--dsw-alias-bg-base'],
      ['--dsw-alias-label-secondary', '--dsw-alias-bg-base'],
      ['--dsw-alias-label-tertiary', '--dsw-alias-bg-base'],
      ['--dsw-alias-link', '--dsw-alias-bg-base'],
      ['--dsw-alias-state-error-primary', '--dsw-alias-bg-base'],
      ['--dsw-alias-state-success-primary', '--dsw-alias-bg-base'],
      ['--dsw-alias-state-warn-primary', '--dsw-alias-bg-base'],
      ['--dsw-alias-label-primary-inverted', '--dsw-alias-button-primary-fill'],
      ['--dsw-alias-label-primary-inverted', '--dsw-alias-button-primary-hover'],
      ['--dsw-alias-toast-label', '--dsw-alias-toast-bg']
    ];
    for (const [fg, bg] of pairs) {
      const ratio = contrast(t[fg], t[bg]);
      assert.ok(ratio >= 4.5, `${mode}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1`);
    }
  }
});
