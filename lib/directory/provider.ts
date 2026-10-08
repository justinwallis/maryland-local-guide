import type { DirectoryReadAdapter } from "./types";
import { representativeDirectoryAdapter } from "./representative-adapter";
import { wordpressDirectoryAdapter } from "./wordpress-adapter";

export function getDirectoryReadAdapter(): DirectoryReadAdapter {
  const source = process.env.MLG_DIRECTORY_SOURCE ?? "representative";

  if (source === "representative") {
    return representativeDirectoryAdapter;
  }

  if (source === "wordpress") {
    if (process.env.MLG_LIVE_DIRECTORY_ACCEPTED !== "true") {
      throw new Error(
        "The WordPress directory adapter is staged but not accepted for live use. Keep the representative provider until a controlled published listing passes the live mapping and location-semantics gate.",
      );
    }
    return wordpressDirectoryAdapter;
  }

  throw new Error("Unsupported MLG_DIRECTORY_SOURCE: " + source);
}
