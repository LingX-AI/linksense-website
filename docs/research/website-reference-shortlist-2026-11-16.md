# LinkSense website: reference shortlist and product research

Researched on **November 16, 2026 (Asia/Shanghai)**. The independent site defaults to **English (`en-US`) at `/`** and uses **TanStack Start + React SSR**. The user selected **Exo Ape (option 3)** after this comparison. The [design notes](../design-notes.md) describe the implementation.

## Visual references to choose from

The shortlist separates the site's appearance from the product comparisons below. Choose one main visual reference before turning it into a new site plan.

| Option | Official site | What to look for and how it could fit |
| --- | --- | --- |
| **A — recommended** | [Oxide Computer Company](https://oxide.computer/) | Graphite, fine rules and numbered figure labels surround a rack image and CLI/API/Console views. Use LinkSense's own workspace, file preview and architecture to create that same engineering character. The risk is drifting toward a hardware site; keep the main language about the work teams do. |
| **B** | [Linear](https://linear.app/) | Large white type on near-black, then a full-width product frame showing one specific issue. A good reference for explaining the workspace quickly. The quiet layout needs an ownable LinkSense scene to stand out. |
| **C** | [Tailscale](https://tailscale.com/) | Light background, black type and a row of distinct product entry points. A good choice if the site should feel approachable to both employees and IT; it is the least theatrical of the new options. |
| **D** | [Raycast](https://www.raycast.com/) | The red diagonal forms are built around the brand, and the next sections use the keyboard and app actions as motifs. Use its pacing and interaction ideas if a bold product launch is the priority; use LinkSense's own motifs and colors. |

The six original `bryce-nice-site-creator` references remain selectable:

| Option | Official site | Best fit |
| --- | --- | --- |
| **1** | [Cuberto](https://cuberto.com/) | Space, oversized typography and a rounded showreel for a refined product film. |
| **2** | [Dennis Snellenberg](https://dennissnellenberg.com/) | Moving oversized lettering, magnetic controls and curved transitions for a strong personal or brand voice. |
| **3** | [Exo Ape](https://www.exoape.com/) | Full-screen imagery, skewed reveals and asymmetric layouts for a cinematic story. Needs strong first-party footage or visuals. |
| **4** | [Unseen Studio](https://unseen.co/) | An immersive world with refraction and camera movement. The most demanding option for assets, mobile and fallbacks. |
| **5** | [Aimg](https://animg.vercel.app/) | Light blue, rounded typography, search and a tool directory. A fit if discovering reusable Skills and Apps becomes the main story. |
| **6 — recommended within the skill** | [Appwrite](https://appwrite.io/) | Dark console preview, dotted surfaces and modular platform sections. A strong way to present the breadth of LinkSense. A brand blue accent and solid headline would keep the useful composition without adopting its pink gradient. |

The new visual candidates were viewed at desktop size in the Codex browser; this was a composition spot check, not a motion or mobile audit. The six standard styles use the skill's existing interaction profiles. All official URLs were checked this round. Oxide is the top recommendation for the combination of engineering character and product clarity; Appwrite is the strongest fit among the six prepared profiles.

## Product references

This is a fresh content and information-architecture investigation, not an approved website plan. The earlier research note was used to exclude its nine products. Sources are first-party public pages. No competitor was installed, logged into, or tested.

The comparison baseline is the current [LinkSense README](../../../linksense/README.md): an organization-owned agent workspace that executes tasks and delivers files, shares governed Knowledge, Skills, Plugins, and Applications, connects business systems, and provides model choice, self-hosting, usage controls, and audit records. LinkSense's isolation boundary is the user Worker; external services receive the data sent to them. Those boundaries constrain future copy.

### Five new references

#### 1. Open WebUI — closest overall product scope

Official pages: [Homepage](https://openwebui.com/), [Open Terminal](https://openwebui.com/open-terminal), [Sovereign AI](https://openwebui.com/sovereign-ai).

**Verified overlap.** The current homepage covers a self-hosted workspace, model choice, shared tools and skills, and organizational controls. Open Terminal describes command/code execution, browser and desktop operation, document/data outputs, website creation, and files and previews beside the conversation. Those are direct overlaps with LinkSense's task-and-deliverable positioning. The Sovereign AI page explains models, data paths, identity, and operations as separate deployment decisions. [Homepage](https://openwebui.com/), [Open Terminal](https://openwebui.com/open-terminal), [Sovereign AI](https://openwebui.com/sovereign-ai).

**Borrow for IA/copy.** Show the request, the agent's work, and the resulting report/chart/site together. Give “what people can finish” and “how administrators control it” distinct, linked explanations. Its sovereignty page usefully qualifies data locality according to configured external providers; LinkSense needs equally specific language.

**Comparison boundary.** Open Terminal is a separate integration; its page distinguishes a shared container from separate per-user containers under an Enterprise license. This does not establish equivalent LinkSense deployment, desktop access, packaging, or permissions. Do not import its installation-time, scale, licensing, air-gap, or security promises. [Open Terminal](https://openwebui.com/open-terminal).

#### 2. Dust — closest organizational story

Official pages: [Homepage](https://dust.tt/), [Product](https://dust.tt/home/product).

**Verified overlap.** Dust's current homepage explicitly connects company knowledge, tools, and teams so people can create, share, and run agents. It groups its platform around company context, human-agent work, model flexibility, and governance. Its product page adds reusable skills, agent/model usage visibility, Spaces and Groups, and persistent shared workspaces. [Homepage](https://dust.tt/), [Product](https://dust.tt/home/product).

**Borrow for IA/copy.** Explain shared capabilities through the work they enable: the team connects its context, reuses an agent or skill, finishes a task, and administrators manage access and usage. Use one concrete workflow before presenting a capability catalog. Separate member benefits from the administrator's buying and rollout questions.

**Comparison boundary.** Dust's Pods, Frames, shared conversations, and shared virtual computer describe a collaboration model that the LinkSense README does not establish. Its dedicated single-tenant option does not by itself establish customer-operated self-hosting. Do not reuse “multiplayer,” self-improving skills, provider counts, SOC certifications, data-residency choices, or ROI claims as LinkSense capabilities. [Homepage](https://dust.tt/), [Product](https://dust.tt/home/product).

#### 3. LibreChat — clearest compact capability hierarchy

Official pages: [Homepage](https://www.librechat.ai/), [Agents](https://www.librechat.ai/docs/features/agents), [Documentation](https://www.librechat.ai/docs).

**Verified overlap.** Its homepage leads with three concrete groups: Agents, Models, and Artifacts. It then names Projects, Skills, Subagents, Code Interpreter, MCP, Memory, search, and authentication. Agent documentation describes reusable assistants with instructions, files, tools, sharing, role-controlled tool access, and generated files. The documentation identifies LibreChat as a self-hosted web application. [Homepage](https://www.librechat.ai/), [Agents](https://www.librechat.ai/docs/features/agents), [Documentation](https://www.librechat.ai/docs).

**Borrow for IA/copy.** Use a small first-level capability hierarchy, then expose supporting features in context. Pair short benefit text with a real interface image, and send operational detail to existing documentation. A separate evaluation CTA and installation CTA can serve visitors with different intent.

**Comparison boundary.** Its hero still emphasizes unified AI conversations. LinkSense's primary story should retain completed work, reusable organizational resources, and deployment governance. LibreChat documentation marks stateful code sessions highly experimental, so that page is evidence of an advertised option, not proof of production reliability. Do not import its auth, runtime, sharing, or state persistence semantics. [Homepage](https://www.librechat.ai/), [Agents](https://www.librechat.ai/docs/features/agents).

#### 4. AnythingLLM — useful team/deployment branch, weaker homepage fit

Official pages: [Homepage](https://anythingllm.com/), [Cloud and team deployment](https://anythingllm.com/cloud).

**Verified overlap.** The team page describes a private multi-user workspace hosted by the vendor or self-hosted, with a Docker entry, RAG, agents, model configuration, permissions, and administrator controls. The current homepage instead prioritizes a local desktop assistant, document knowledge, web research, background jobs, and custom agent skills. [Cloud](https://anythingllm.com/cloud), [Homepage](https://anythingllm.com/).

**Borrow for IA/copy.** Make deployment choices explicit and intelligible. Keep a direct self-hosting path visible beside enterprise contact, and explain what members use versus what administrators configure. The homepage's simple setup sequence is a useful content pattern only if replaced with LinkSense's actual setup.

**Comparison boundary.** Desktop downloads, on-device meetings, Android, no-account usage, bundled local models, and “no API keys” belong to its desktop offer. Those should not become LinkSense promises or primary CTAs. Its pricing and isolation claims do not establish the same model for LinkSense. [Homepage](https://anythingllm.com/), [Cloud](https://anythingllm.com/cloud).

#### 5. Onyx — strong knowledge, permissions, and enterprise evidence

Official pages: [Homepage](https://onyx.app/), [Agents & Actions](https://onyx.app/agents-actions).

**Verified overlap.** Its current homepage leads with enterprise context for humans and agents, then retrieval examples, deployment, model choice, connectors, and interfaces. Agents & Actions separately describes custom instructions, knowledge, external actions, sharing with users/groups, and organizational usage analytics. [Homepage](https://onyx.app/), [Agents & Actions](https://onyx.app/agents-actions).

**Borrow for IA/copy.** Show a recognizable business question, authorized source context, and an answer with evidence. Keep user/group sharing and deployment explanations close to the capabilities they qualify. It is a good reference for making organizational knowledge concrete rather than describing “knowledge management” abstractly.

**Comparison boundary.** Onyx's current emphasis is context and retrieval, narrower than LinkSense's general task execution and file delivery. Its homepage now carries a joining-Zoom announcement; evaluate the actual current pages rather than old positioning. Do not copy its retrieval benchmarks, performance/cost numbers, customer outcomes, connector counts, or fully air-gapped claims. [Homepage](https://onyx.app/).

### Content recommendation

For the next comparison round, prioritize **Open WebUI** for task-to-output explanation, **Dust** for the organization-wide narrative, and **LibreChat** for a compact feature hierarchy. AnythingLLM's team page and Onyx's knowledge/permissions sections are supporting references. This ranking is an editorial judgment against the LinkSense README, not a product-quality ranking or a selected visual style.

Possible original English copy territory to test later: **“An agent workspace your organization can run.”** Supporting text can explain tasks and files, shared capabilities, controlled connections, and deployment/model choice. This is exploratory copy, not an approved headline. It should be evaluated against the user's visual-reference choice before a new site plan is written.

Product capability comparisons are based on public content and documentation; the Open Terminal page was also opened for a desktop visual spot check. Exact capabilities by competitor edition and runtime behavior were not tested.
