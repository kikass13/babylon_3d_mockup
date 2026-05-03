#!/bin/bash

#!/usr/bin/env bash
set -e

APP_NAME="babylon-3d-editor"
WP_PLUGIN_DIR="wordpress-plugin"
WP_ASSETS_DIR="$WP_PLUGIN_DIR/assets"

echo "Cleaning old builds..."
rm -rf dist
rm -rf "$WP_PLUGIN_DIR"
rm -f "${APP_NAME}-prod.zip"
rm -f "${APP_NAME}-wordpress.zip"

echo "Installing dependencies..."
npm install

echo "Building production bundle..."
npm run build

echo "Creating standalone production zip..."
zip -r "${APP_NAME}-prod.zip" dist package.json package-lock.json README.md

echo "Creating WordPress-ready structure..."
mkdir -p "$WP_ASSETS_DIR"

cp -r dist/assets "$WP_ASSETS_DIR/"
cp dist/index.html "$WP_PLUGIN_DIR/index-reference.html"

cat > "$WP_PLUGIN_DIR/${APP_NAME}.php" <<'PHP'
<?php
/**
 * Plugin Name: Babylon 3D Editor Mockup
 * Description: Babylon.js 3D editor prototype bundled with Vite.
 * Version: 1.0.0
 * Author: Cubonic
 */

if (!defined('ABSPATH')) {
    exit;
}

function babylon_3d_editor_enqueue_assets() {
    $plugin_url = plugin_dir_url(__FILE__);
    $plugin_dir = plugin_dir_path(__FILE__);

    $js_files = glob($plugin_dir . 'assets/*.js');
    $css_files = glob($plugin_dir . 'assets/*.css');

    foreach ($css_files as $css_file) {
        wp_enqueue_style(
            'babylon-3d-editor-style',
            $plugin_url . 'assets/' . basename($css_file),
            [],
            filemtime($css_file)
        );
    }

    foreach ($js_files as $js_file) {
        wp_enqueue_script(
            'babylon-3d-editor-app',
            $plugin_url . 'assets/' . basename($js_file),
            [],
            filemtime($js_file),
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'babylon_3d_editor_enqueue_assets');

function babylon_3d_editor_shortcode() {
    babylon_3d_editor_enqueue_assets();

    return '<div id="app">
        <canvas id="renderCanvas"></canvas>
        <div id="babylon-editor-ui"></div>
    </div>';
}
add_shortcode('babylon_3d_editor', 'babylon_3d_editor_shortcode');
PHP

echo "Creating WordPress plugin zip..."
zip -r "${APP_NAME}-wordpress.zip" "$WP_PLUGIN_DIR"

echo ""
echo "Done."
echo "Standalone build: ${APP_NAME}-prod.zip"
echo "WordPress plugin:  ${APP_NAME}-wordpress.zip"