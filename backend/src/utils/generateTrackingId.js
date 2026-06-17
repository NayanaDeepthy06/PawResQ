function generateTrackingId() {

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let id = "PRQ-";

  for (
    let i = 0;
    i < 6;
    i++
  ) {

    id += chars.charAt(
      Math.floor(
        Math.random() *
        chars.length
      )
    );

  }

  return id;
}

export default generateTrackingId;