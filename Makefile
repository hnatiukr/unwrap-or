#
# global variables
#

OUT_DIR = lib
PACKAGE_NAME = $$(node -p "require('./package.json').name")
PACKAGE_VERSION = $$(node -p "require('./package.json').version")

#
# targets
#

.PHONY: install
install:
	@echo "\n> Installing dependecies..."
	@pnpm install
	@echo "[ok] Installation completed."

.PHONY: build
build:
	@echo "\n> Compiling input TypeScript source files into './$(OUT_DIR)/' directory..."
	@rm -rf $(OUT_DIR)
	@npx tsc --build tsconfig.build.json
	@echo "[ok] Compilation has been complited."

.PHONY: fmt
fmt:
	@echo "\n> Formatting..."
	@npx prettier --write --log-level error --list-different .
	@echo "[ok] Formatting has been completed."

.PHONY: fmt-check
fmt-check:
	@echo "\n> Checking formatting..."
	@npx prettier --check --log-level error .
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

.PHONY: dry-publication
dry-publication:
	@make checks build
	@echo "\n> Publishing $(PACKAGE_NAME)@$(PACKAGE_VERSION) in DRY mode..."
	@npm publish --dry-run --tag v.$(PACKAGE_VERSION)
	@echo "[ok] DRY publication has been completed."

.PHONY: publication
publication:
	@make checks build
	@echo "\n> Publishing $(PACKAGE_NAME)@$(PACKAGE_VERSION) in DRY mode..."
	@npm publish --tag v.$(PACKAGE_VERSION)
	@echo "[ok] DRY publication has been completed."
