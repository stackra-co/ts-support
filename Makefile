# Makefile for Frontend Template Monorepo
# Provides convenient shortcuts for common development tasks

.PHONY: help install dev build clean test lint format check deploy

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

## help: Display this help message
help:
	@echo "$(BLUE)Frontend Template Monorepo - Available Commands$(NC)"
	@echo ""
	@grep -E '^## [a-zA-Z_-]+:.*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = "## |:"}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$2, $$3}'

## install: Install all dependencies
install:
	@echo "$(BLUE)Installing dependencies...$(NC)"
	pnpm install

## dev: Start development servers for all apps
dev:
	@echo "$(BLUE)Starting development servers...$(NC)"
	pnpm dev

## dev-web: Start development server for web app only
dev-web:
	@echo "$(BLUE)Starting web app...$(NC)"
	pnpm dev:web

## dev-docs: Start development server for docs app only
dev-docs:
	@echo "$(BLUE)Starting docs app...$(NC)"
	pnpm dev:docs

## build: Build all packages and apps
build:
	@echo "$(BLUE)Building all packages and apps...$(NC)"
	pnpm build

## build-packages: Build only packages
build-packages:
	@echo "$(BLUE)Building packages...$(NC)"
	pnpm build:packages

## build-apps: Build only apps
build-apps:
	@echo "$(BLUE)Building apps...$(NC)"
	pnpm build:apps

## clean: Clean all build artifacts and caches
clean:
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	pnpm clean

## clean-all: Clean everything including node_modules
clean-all:
	@echo "$(RED)Cleaning everything...$(NC)"
	pnpm clean:deps
	rm -rf .turbo

## reset: Clean and reinstall everything
reset: clean-all install
	@echo "$(GREEN)Reset complete!$(NC)"

## test: Run all tests
test:
	@echo "$(BLUE)Running tests...$(NC)"
	pnpm test

## test-watch: Run tests in watch mode
test-watch:
	@echo "$(BLUE)Running tests in watch mode...$(NC)"
	pnpm test:watch

## test-coverage: Run tests with coverage
test-coverage:
	@echo "$(BLUE)Running tests with coverage...$(NC)"
	pnpm test:coverage

## lint: Run linter on all packages
lint:
	@echo "$(BLUE)Running linter...$(NC)"
	pnpm lint

## lint-fix: Run linter and fix issues
lint-fix:
	@echo "$(BLUE)Running linter with auto-fix...$(NC)"
	pnpm lint:fix

## format: Format all code
format:
	@echo "$(BLUE)Formatting code...$(NC)"
	pnpm format

## format-check: Check code formatting
format-check:
	@echo "$(BLUE)Checking code formatting...$(NC)"
	pnpm format:check

## check-types: Run TypeScript type checking
check-types:
	@echo "$(BLUE)Checking types...$(NC)"
	pnpm check-types

## check: Run all checks (lint, format, types)
check: lint format-check check-types
	@echo "$(GREEN)All checks passed!$(NC)"

## validate: Run full validation (lint, types, build)
validate:
	@echo "$(BLUE)Running full validation...$(NC)"
	pnpm validate

## audit: Run security audit
audit:
	@echo "$(BLUE)Running security audit...$(NC)"
	pnpm audit

## audit-fix: Fix security vulnerabilities
audit-fix:
	@echo "$(BLUE)Fixing security vulnerabilities...$(NC)"
	pnpm audit:fix

## update: Update all dependencies
update:
	@echo "$(BLUE)Updating dependencies...$(NC)"
	pnpm update:deps

## changeset: Create a new changeset
changeset:
	@echo "$(BLUE)Creating changeset...$(NC)"
	pnpm changeset

## version: Version packages based on changesets
version:
	@echo "$(BLUE)Versioning packages...$(NC)"
	pnpm changeset:version

## release: Build and publish packages
release:
	@echo "$(BLUE)Releasing packages...$(NC)"
	pnpm release

## docker-build: Build Docker images
docker-build:
	@echo "$(BLUE)Building Docker images...$(NC)"
	docker compose build

## docker-up: Start Docker containers
docker-up:
	@echo "$(BLUE)Starting Docker containers...$(NC)"
	docker compose up -d

## docker-down: Stop Docker containers
docker-down:
	@echo "$(BLUE)Stopping Docker containers...$(NC)"
	docker compose down

## docker-logs: View Docker logs
docker-logs:
	@echo "$(BLUE)Viewing Docker logs...$(NC)"
	docker compose logs -f

## docker-dev: Start with wildcard domain proxy
docker-dev:
	@echo "$(BLUE)Starting with wildcard domain proxy...$(NC)"
	docker compose up -d proxy
	@echo "$(GREEN)Open http://pixielity.test$(NC)"

## graph: Generate dependency graph
graph:
	@echo "$(BLUE)Generating dependency graph...$(NC)"
	pnpm graph
	@echo "$(GREEN)Graph saved to dependency-graph.html$(NC)"

## info: Display project information
info:
	@echo "$(BLUE)Project Information:$(NC)"
	@echo "  Node version: $$(node --version)"
	@echo "  pnpm version: $$(pnpm --version)"
	@echo "  Turbo version: $$(pnpm turbo --version)"
	@echo ""
	@echo "$(BLUE)Workspace Packages:$(NC)"
	@pnpm list --depth 0 --workspace-root

## ci: Run CI checks locally
ci: lint check-types build test
	@echo "$(GREEN)CI checks passed!$(NC)"

## sync-configs: Apply unified config templates to all packages
sync-configs:
	@echo "$(BLUE)Syncing config files...$(NC)"
	pnpm sync-configs

## fix-deps: Fix @abdokouta/* deps to workspace:*
fix-deps:
	@echo "$(BLUE)Fixing workspace dependencies...$(NC)"
	pnpm fix-deps

## setup-domains: Set up wildcard subdomains for local dev
setup-domains:
	@echo "$(BLUE)Setting up local wildcard domains...$(NC)"
	./scripts/wildcard-domain/setup-local-domains.sh
