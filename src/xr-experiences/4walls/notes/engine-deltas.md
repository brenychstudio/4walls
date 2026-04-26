# Engine Deltas — 4walls

---

## Delta 001
### Date
2026-04-18
### Type
capability
### Area
triggers
### Problem
Для door XR потрібен не просто proximity enter, а керований ritual of looking через gaze-hold.
### Context
Desktop preview / Door XR threshold scene.
### Local Fix
Реалізовано hold-gaze activation на вічку з порогом часу перед portal reveal.
### Why It Worked
Дає драматургічний вхід у сцену замість випадкового тригера.
### Repeat Potential
high
### Promotion Candidate
core-candidate
### Promotion Reason
Gaze-hold trigger pattern може повторюватись у багатьох XR-сценах.
### Affected Files
- src/xr/4walls/FourWallsXRRoot.jsx
### Follow-up
Перевірити на ще одному XR-проєкті.

---

## Delta 002
### Date
2026-04-18
### Type
workaround
### Area
locomotion
### Problem
Вільний підхід до дверей давав відчуття debug-walk і ламав композицію сцени.
### Context
Desktop preview / Door XR threshold scene.
### Local Fix
Додано soft lane-guidance, clamp near-door зону, м’яке центрування перед вічком.
### Why It Worked
Підхід став режисованим і перестав бути хаотичним.
### Repeat Potential
high
### Promotion Candidate
extension-candidate
### Promotion Reason
Патерн корисний, але потребує гнучкого adapter/hook, а не жорсткого core behavior.
### Affected Files
- src/xr/4walls/FourWallsXRRoot.jsx
### Follow-up
Винести як configurable approach behavior після другого кейсу.

---

## Delta 003
### Date
2026-04-18
### Type
bug
### Area
input
### Problem
Ліво/право в desktop movement були реверснуті.
### Context
Desktop preview / PointerLockControls + keyboard locomotion.
### Local Fix
Виправлено side-vector / sign logic для A/D movement.
### Why It Worked
Рух став відповідати очікуваній просторовій орієнтації.
### Repeat Potential
high
### Promotion Candidate
core-candidate
### Promotion Reason
Input normalization — очевидний engine-level concern.
### Affected Files
- src/xr/4walls/FourWallsXRRoot.jsx
### Follow-up
Перевірити на інших XR-сценах.

---

## Delta 004
### Date
2026-04-18
### Type
capability
### Area
media
### Problem
Малий video-in-peephole reveal виглядав технічно, але не читався як подія.
### Context
Door XR / peephole portal reveal.
### Local Fix
Замість малого локального відео реалізовано cinematic peephole takeover з camera-attached portal layer.
### Why It Worked
Увага глядача концентрується на одному transition state, а не на кількох конфліктних шарах.
### Repeat Potential
medium
### Promotion Candidate
extension-candidate
### Promotion Reason
Патерн сильний, але ще занадто authored-specific; краще як extensible reveal hook.
### Affected Files
- src/xr/4walls/FourWallsXRRoot.jsx
### Follow-up
Подивитись, чи повториться подібна логіка в іншому проекті.

---

## Delta 005
### Date
2026-04-18
### Type
observation
### Area
ui-shell
### Problem
Глобальні або route-level XR CTA легко ламають композицію web-flow і виглядають як зовнішня фіча.
### Context
Door route / web → XR bridge.
### Local Fix
Відмовились від постійної floating XR-кнопки; правильний напрямок — XR як частина драматургії door continuation.
### Why It Worked
XR починає читатись як narrative phase, а не окремий product feature.
### Repeat Potential
medium
### Promotion Candidate
local-only
### Promotion Reason
Це скоріше story-architecture decision, ніж універсальна engine-поведінка.
### Affected Files
- src/app/StoryShell.tsx
- src/pages/xr/FourWallsXRPage.jsx
### Follow-up
Зафіксувати фінальну bridge logic після завершення door flow.

---

## Delta 006
### Date
2026-04-18
### Type
capability
### Area
audio
### Problem
Простий synth hum звучав штучно і не відповідав threshold / signal естетиці сцени.
### Context
Door XR / procedural audio iteration.
### Local Fix
Замість hum побудовано noise-based interference bed: air layer + static layer + crackle layer.
### Why It Worked
Звук став менш музичним і ближчим до radio/interference texture.
### Repeat Potential
high
### Promotion Candidate
preset-candidate
### Promotion Reason
Це радше reusable mood/audio preset, ніж core behavior.
### Affected Files
- src/xr/4walls/FourWallsXRRoot.jsx
### Follow-up
Замінити на authored real audio assets і порівняти результат.

---

## Delta 007
### Date
2026-04-18
### Type
workaround
### Area
audio
### Problem
Procedural interference bed в локальній реалізації звучить краще за synth hum, але все ще не дорівнює authored sound design.
### Context
Door XR / current prototype stage.
### Local Fix
Залишено temporary procedural bed як dev/milestone solution.
### Why It Worked
Дає правильніший напрямок без блокування розробки через відсутність фінальних sound assets.
### Repeat Potential
medium
### Promotion Candidate
preset-candidate
### Promotion Reason
Noise bed profile можна зберегти як fallback / dev preset.
### Affected Files
- src/xr/4walls/FourWallsXRRoot.jsx
### Follow-up
Порівняти з real sound assets.

---

## Delta 008
### Date
2026-04-18
### Type
limitation
### Area
media
### Problem
Великі mp4-файли не проходять у звичайний GitHub push flow.
### Context
Repo push / deploy preparation.
### Local Fix
Final fix не реалізовано.
### Why It Worked
не вказано
### Repeat Potential
high
### Promotion Candidate
core-candidate
### Promotion Reason
Потрібна універсальна стратегія media/deploy handling для XR/web projects.
### Affected Files
- не вказано
### Follow-up
Вирішити через LFS / external hosting / optimized media pipeline.

---

## Delta 009
### Date
2026-04-18
### Type
capability
### Area
xr-session
### Problem
Потрібно було безпечно інтегрувати XR у вже існуючий 2D story project без повного переписування flow.
### Context
4WALLS / hybrid web + XR project.
### Local Fix
Створено окремий XR route `/xr/door`, authored XR root і route-level bridge назад у web.
### Why It Worked
Дозволило побудувати XR як local proof поверх frozen baseline.
### Repeat Potential
high
### Promotion Candidate
extension-candidate
### Promotion Reason
Pattern дуже корисний, але ще потребує перевірки на інших проектах.
### Affected Files
- src/pages/xr/FourWallsXRPage.jsx
- src/xr/4walls/FourWallsXRRoot.jsx
- src/xr/4walls/build4WallsManifest.js
- src/xr-core/runtime/XRRootThree.jsx
### Follow-up
Порівняти з наступним XR-проектом.

---

## Delta 010
### Date
2026-04-18
### Type
observation
### Area
runtime
### Problem
Преміальний результат досягається не через більшу кількість geometry, а через світло, focus logic, reveal pacing і controlled atmosphere.
### Context
Door XR premium polish iterations.
### Local Fix
Сцену не перевантажували props/decor, а полірували через chamber lighting, peephole optics, portal transition, particles cleanup.
### Why It Worked
Сцена стала кінематографічнішою і менш схожою на debug-room.
### Repeat Potential
medium
### Promotion Candidate
preset-candidate
### Promotion Reason
Більше схоже на reusable environment / art-direction preset family.
### Affected Files
- src/xr/4walls/FourWallsXRRoot.jsx
### Follow-up
Звірити з іншими authored XR environments.
