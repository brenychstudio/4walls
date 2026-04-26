# Universalization Review — 4walls

## 1. What Repeated
Поточний проект ще в активній розробці, тому це milestone review, а не фінальний review.

Уже видно повторювані патерни, які потенційно можуть перетнутися з іншими XR-кейсами:
- input normalization issues
- movement comfort / approach control near focal object
- gaze-trigger behavior
- video surface lifecycle inside authored immersive scene
- route-level bridge between web shell and XR scene
- authored chamber atmosphere patterns
- audio texture need for threshold/interference scenes

## 2. What Feels Reusable
Потенційно reusable:
- gaze-hold trigger logic
- approach lane / focal alignment behavior
- portal reveal lifecycle
- web→XR→web continuation contract
- threshold chamber preset family
- interference audio preset family
- media surface / takeover helper logic
- XR route shell integration pattern

## 3. What Should Stay Local
Точно не варто переносити в core зарано:
- door as symbolic threshold
- ritual of looking
- exact portal choreography
- exact pacing of reveal / aftermath
- infection logic between door / phone / wash
- story-specific continuation rules

## 4. Promotion Candidates

### Core
- input normalization fixes
- generic gaze-hold trigger executor
- media surface lifecycle guardrails
- route/session return contract diagnostics
- deployment/media handling strategy for heavy XR/web projects

### Presets
- threshold chamber environment profile
- interference audio mood profile
- camera feel / approach sensitivity profile
- reveal pacing profile

### Extension Points
- authored portal reveal hook
- web→XR continuation adapter
- aftermath state hook
- focal-object interaction adapter

### Local Only
- door symbolic meaning
- peephole ritual
- exact takeover staging
- authored consequence semantics

## 5. Risks
- проект ще не завершений
- лише одна XR-сцена реально опрацьована
- немає другого підтвердження для promotion у core
- phone/wash XR layers не реалізовані
- deploy/media strategy не вирішена
- частина sound logic тимчасова

## 6. Recommendation
wait for second project / keep local

## Current Milestone Conclusion
4WALLS вже дає сильний матеріал для Whisper XR, але на поточному етапі його треба розглядати як:
- local authored proof
- engine delta source
- preset discovery source

Фінальне рішення про promotion у core варто приймати:
- після завершення 4WALLS door flow
- і після порівняння з мінімум ще одним XR-проектом
