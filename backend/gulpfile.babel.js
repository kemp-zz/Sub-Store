import fs from 'fs';
import browserify from 'browserify';
import gulp from 'gulp';
import prettier from 'gulp-prettier';
import header from 'gulp-header';
import eslint from 'gulp-eslint-new';

import pkg from './package.json';

const DEST_FILE = 'sub-store.min.js';

export function lint() {
	return gulp
		.src('src/**/*.js')
		.pipe(eslint({ fix: true }))
		.pipe(eslint.fix())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
}

export function styles() {
	return gulp
		.src('src/**/*.js')
		.pipe(
			prettier({
				singleQuote: true,
				trailingComma: 'all',
				tabWidth: 4,
				bracketSpacing: true
			})
		)
		.pipe(gulp.dest((file) => file.base));
}

export function scripts() {
	return browserify('src/main.js')
		.transform('babelify', {
			presets: [ [ '@babel/preset-env' ] ]
		})
		.plugin('tinyify')
		.bundle()
		.pipe(fs.createWriteStream(DEST_FILE));
}

export function banner() {
	return gulp
		.src(DEST_FILE)
		.pipe(header(fs.readFileSync('./banner', 'utf-8'), { pkg, updated: new Date().toLocaleString() }))
		.pipe(gulp.dest((file) => file.base));
}

const build = gulp.series(lint, styles, scripts, banner);

export default build;