export async function buildManifest() {
  return {
    schemaVersion: 1,
    experienceId: "4walls-door-threshold",
    zones: [{ id: "threshold", label: "Threshold" }],
    artworks: [
      {
        id: "door-threshold-frame",
        printId: "4walls-door-threshold-frame",
        zoneId: "threshold",
        src: "/fourwalls/act03/door-poster.jpg",
        title: "Door threshold",
        caption: "Frozen threshold / corridor pressure",
      },
    ],
    beats: [
      {
        id: "threshold-beat-01",
        zoneId: "threshold",
        artworkPrintId: "4walls-door-threshold-frame",
        guidance: { type: "beacon", intensity: 0.72 },
        onGaze: ["threshold-focus"],
        onProximity: ["threshold-near"],
      },
    ],
    collect: {
      mode: "qr",
      shareBasePath: "/p/",
    },
  };
}
