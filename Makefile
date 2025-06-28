#
# global variables
#

OUT_DIR = lib
TEMP_DIR = _temp
PACKAGE_NAME = $$(node -p "require('./package.json').name")
PACKAGE_VERSION = $$(node -p "require('./package.json').version")

#
# lib targets
#

.PHONY: install
install:
	@echo "\n> Installing dependecies..."
	@pnpm install --frozen-lockfile
	@echo "[ok] Installation completed."

.PHONY: prebuild
prebuild:
	@echo "\n> Compiling input TypeScript source files into '$(TEMP_DIR)' directory..."
	@npx tsc -p tsconfig.build.json --outDir $(TEMP_DIR) --declarationDir $(TEMP_DIR)
	@echo "[ok] Compilation has been complited."

.PHONY: minify-js
minify-js:
	@echo "\n> Minifying all .js files from '$(TEMP_DIR)' to '$(OUT_DIR)'..."
	@find $(TEMP_DIR) -type f -name "*.js" | while read file; do \
	out="$(OUT_DIR)/$${file#$(TEMP_DIR)/}"; \
		mkdir -p "$$(dirname "$$out")"; \
		npx terser "$$file" --compress --mangle --comments false --output "$$out"; \
	done
	@echo "[ok] Minification done."

.PHONY: copy-dts
copy-dts:
	@echo "\n> Copying declaration files from '$(TEMP_DIR)' to '$(OUT_DIR)'..."
	@npx copyfiles -u 1 "$(TEMP_DIR)/**/*.d.ts" $(OUT_DIR)
	@echo "[ok] Declaration files have been copied."

.PHONY: build
build:
	@rm -rf $(TEMP_DIR) $(OUT_DIR)
	@make prebuild minify-js copy-dts
	@rm -rf $(TEMP_DIR)

.PHONY: fmt
fmt:
	@echo "\n> Formatting..."
	@npx prettier --write --log-level error --list-different "src/**/*.ts" "tests/**/*.ts" "README.md"
	@echo "[ok] Formatting has been completed."

.PHONY: fmt-check
fmt-check:
	@echo "\n> Checking formatting..."
	@npx prettier --check --log-level error "src/**/*.ts" "tests/**/*.ts" "README.md"
	@echo "[ok] Checking formatting has been completed."

.PHONY: type-check
type-check:
	@echo "\n> Checking types..."
	@npx tsc
	@echo "[ok] Checking types has been completed."

.PHONY: checks
checks:
	@make fmt-check type-check

.PHONY: test
test:
	@echo "\n> Running tests..."
	@npx vitest run
	@echo "[ok] Testing has been completed."

.PHONY: ci
ci:
	@make checks test build

.PHONY: dry-publication
dry-publication:
	@echo "\n> Publishing $(PACKAGE_NAME)@$(PACKAGE_VERSION) in DRY mode..."
	@npm publish --dry-run --tag v.$(PACKAGE_VERSION)
	@echo "[ok] DRY publication has been completed."

.PHONY: publication
publication:
	@make checks build
	@echo "\n> Publishing $(PACKAGE_NAME)@$(PACKAGE_VERSION) in DRY mode..."
	@npm publish --tag v.$(PACKAGE_VERSION)
	@echo "[ok] DRY publication has been completed."

#
# docs targets
#

.PHONY: docs-dev
docs-dev:
	@cd docs && pnpm docusaurus start

.PHONY: docs-build
docs-build:
	@cd docs && pnpm docusaurus build

.PHONY: docs-serve
docs-serve:
	@cd docs && pnpm docusaurus serve

.PHONY: docs-deploy
docs-deploy:
	@cd docs && gh-pages -d build
