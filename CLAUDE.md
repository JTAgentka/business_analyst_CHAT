# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js TypeScript application demonstrating advanced voice agent patterns using the OpenAI Realtime API and OpenAI Agents SDK. The project showcases multi-agent orchestration patterns for customer service and chat-supervisor scenarios.

## Common Commands

```bash
# Development
npm run dev              # Start development server on localhost:3001
npm run build            # Build production bundle
npm run start            # Start production server
npm run lint             # Run ESLint for code quality checks

# Installation
npm install              # Install all dependencies
```

## High-Level Architecture

### Core Agent Patterns

1. **Chat-Supervisor Pattern** (`src/app/agentConfigs/chatSupervisor/`)
   - Real-time chat agent handles basic interactions
   - Supervisor agent (GPT-4.1) handles complex tasks and tool calls
   - Orchestrates handoffs between agents for optimal performance

2. **Sequential Handoff Pattern** (`src/app/agentConfigs/customerServiceRetail/`)
   - Specialized agents handle specific user intents
   - Agent graph defines valid handoff paths
   - Includes orchestrator agent for Czech J&T Bank onboarding process

### Key Components

- **RealtimeSession Hook** (`src/app/hooks/useRealtimeSession.ts`): Manages WebRTC connection and real-time communication with OpenAI API
- **Agent Configurations** (`src/app/agentConfigs/`): Defines agent behaviors, tools, and handoff rules using OpenAI Agents SDK
- **Transcript Management** (`src/app/contexts/TranscriptContext.tsx`): Handles conversation history and UI updates
- **Guardrails** (`src/app/agentConfigs/guardrails.ts`): Output moderation and safety checks

### Agent Communication Flow

1. Client establishes WebRTC connection via `/api/session` endpoint
2. Audio/text streams between client and OpenAI Realtime API
3. Agents process messages and can trigger handoffs via tool calls
4. Session updates propagate new agent instructions and tools
5. Guardrails validate assistant outputs before display

### Important Files

- `src/app/App.tsx`: Main application component, handles agent selection and session management
- `src/app/agentConfigs/index.ts`: Central registry of all agent configurations
- `src/app/agentConfigs/customerServiceRetail/orchestratorAgent.ts`: Main orchestrator for Czech banking onboarding
- `src/app/hooks/useRealtimeSession.ts`: Core WebRTC and real-time session management

## Development Notes

- Environment variable `OPENAI_API_KEY` required in `.env` or system environment
- Codec selection available via `?codec=` query parameter (opus/pcmu/pcma)
- Agent scenarios selectable via UI dropdown or `?agentConfig=` parameter
- All agent handoffs managed through OpenAI Agents SDK's built-in mechanisms