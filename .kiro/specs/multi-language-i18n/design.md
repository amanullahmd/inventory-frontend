# Design Document: Multi-Language (i18n) Support

## Overview

This design implements a lightweight, performant i18n system for the inventory management application using a custom React Context-based approach. The system supports English and Bangla with full RTL support, language persistence, and zero-dependency translation management. The architecture prioritizes simplicity, performance, and maintainability over heavy i18n libraries.

**Key Design Decisions:**
- Custom Context-based i18n instead of next-i18next (simpler, fewer dependencies)
- JSON-based translation files for easy maintenance
- localStorage for language persistence
- CSS-based RTL support via `dir` attribute
- Lazy loading of translation files for performance

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Root                          │
│                  (RootLayout/App)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              I18nProvider (Context)                          │
│  - Manages language state                                    │
│  - Loads translations                                        │
│  - Provides useI18n hook                                     │
└──────