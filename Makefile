#
# global variables
#

OUT_DIR = lib
PACKAGE_NAME = $$(node -p "require('./package.json').name")
PACKAGE_VERSION = $$(node -p "require('./package.json').version")

#
# targets
#

install:
	@echo "\n> Installing dependecies..."
	@pnpm install
	@echo "[ok] Installation completed."

build-dts:
	@echo "\n> Copying declaration files into output '$(OUT_DIR)/' dir..."
	@npx copyfiles --up 1 --all \"./src/**/*.d.ts\" lib
	@echo "[ok] Declaration files have been copied."

build-js:
	@echo "\n> Compiling input TypeScript source files..."
	@npx tsc --build tsconfig.build.json
	@npx tsc-alias -p tsconfig.build.json
	@echo "[ok] Compilation has been complited."

build:
	@rm -rf $(OUT_DIR)
	@make build-dts build-js

fmt:
	@echo "\n> Formatting..."
	@npx prettier --write --log-level error --list-different .
	@echo "[ok] Formatting has been completed."

check-fmt:
	@echo "\n> Checking formatting..."
	@npx prettier --check --log-level error .
	@echo "[ok] Checking formatting has been completed."

check-types:
	@echo "\n> Checking types..."
	@npx tsc
	@echo "[ok] Checking types has been completed."

checks:
	@make check-fmt check-types

test:
	@echo "\n> Running tests..."
	@npx vitest run
	@echo "[ok] Testing has been completed."

copy-npm:
	@echo "\n> Copying package files into output '$(OUT_DIR)/' dir..."
	@cp package.json $(OUT_DIR)
	@cp README.md $(OUT_DIR)
	@cp LICENSE $(OUT_DIR)
	@echo "[ok] Files have been copied."

dry-publication:
	@make checks build
	@echo "\n> Publishing $(PACKAGE_NAME)@$(PACKAGE_VERSION) in DRY mode..."
	@npm publish --dry-run --tag v.$(PACKAGE_VERSION)
	@echo "[ok] DRY publication has been completed."

publication:
	@make checks build
	@echo "\n> Publishing $(PACKAGE_NAME)@$(PACKAGE_VERSION) in DRY mode..."
	@npm publish --tag v.$(PACKAGE_VERSION)
	@echo "[ok] DRY publication has been completed."

#
# phonies
#

.PHONY: install build-dts build-js build fmt check-fmt check-types checks test copy-npm dry-publication publication
