import type { DirectoryReadAdapter } from "./types";
import { representativeDirectoryAdapter } from "./representative-adapter";

export function getDirectoryReadAdapter(): DirectoryReadAdapter {
  const source = process.env.MLG_DIRECTORY_SOURCE ?? "representative";

  if (source !== "representative") {
    throw new Error(
      "Live directory data is not enabled. The WordPress/Directorist read contract must be verified before MLG_DIRECTORY_SOURCE can select a live adapter.",
    );
  }

  return representativeDirectoryAdapter;
}
