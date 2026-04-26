# Validation Matrix — 4walls

## Desktop Preview
- [x] scene boots correctly
- [x] camera initializes correctly
- [x] keyboard movement works
- [x] mouse look works
- [x] focus/hint shell behaves correctly
- [ ] collector action works
- [x] transitions do not break scene state

## Mobile
- [ ] touch navigation works
- [ ] viewport is correct
- [ ] UI overlay is readable
- [ ] no broken orientation behavior
- [ ] performance acceptable
- [ ] media playback stable

## Tablet
- [ ] device orientation behaves correctly
- [ ] no inverted yaw/pitch
- [ ] framing feels correct
- [ ] no stereo/fisheye-like distortion
- [ ] touch + orientation combination is stable

## XR / VR
- [x] XR entry works
- [x] session starts correctly
- [ ] locomotion is comfortable
- [ ] snap turn / movement works
- [ ] interaction targets are reachable
- [ ] collector / trigger interactions work
- [x] exit returns cleanly

## Media
- [x] still images load correctly
- [x] video surfaces behave correctly
- [x] texture loading is stable
- [ ] fallback works when media fails

## Audio
- [x] ambient audio starts correctly
- [ ] zone logic works
- [x] trigger audio behaves correctly
- [ ] no broken autoplay edge cases

## Triggers / Events
- [x] proximity triggers fire correctly
- [x] gaze triggers behave correctly
- [x] one-shot events do not retrigger incorrectly
- [ ] progression logic is stable

## Performance
- [ ] acceptable FPS on desktop
- [ ] acceptable FPS on mobile/tablet
- [ ] no heavy memory spikes
- [ ] resize / re-entry does not degrade performance

## Diagnostics
- [ ] failures are visible in logs
- [x] manifest errors are detectable
- [ ] scene failure degrades gracefully

## Notes
Поточна matrix відображає milestone-level стан під час активної розробки.
Door XR threshold scene працює як локальний authored proof.
Phone / wash XR scenes не реалізовані.
Public deploy / production validation не завершені.
