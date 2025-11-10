export const createDirectoryUnavailableState = () => ({
  status: "Directory browsing not available outside Electron.",
  isBrowsing: false,
  tree: null,
  path: "",
  searchResults: [],
  searchStatus: "Directory search not available outside Electron.",
  searchQuery: "",
  isSearching: false,
  selectedEntry: null,
  previewStatus: "File preview not available outside Electron.",
  previewDataUrl: "",
  previewText: "",
  isLoadingPreview: false,
});
// tree: result.root, status: "Directory tree loaded.",  path: result.root.path || "",
// overrides tree, status, path fields
// tree는 기본 필드에 없지만 overrides로 전달하면 최종 상태 객체에 포함
export const createDirectoryReadyState = (overrides = {}) => ({
  status: "Select a directory to explore.",
  isBrowsing: false,
  searchStatus: "Enter text to search in the selected directory.",
  searchResults: [],
  searchQuery: "",
  isSearching: false,
  selectedEntry: null,
  previewStatus: "Select a file to preview.",
  previewDataUrl: "",
  previewText: "",
  isLoadingPreview: false,
  ...overrides,
});

export const createDirectoryPreviewResetState = (previewStatus) => ({
  previewStatus,
  previewDataUrl: "",
  previewText: "",
  isLoadingPreview: false,
});

export const createDirectoryPreviewLoadingState = (entry) => ({
  selectedEntry: entry,
  previewStatus: "Loading preview...",
  previewDataUrl: "",
  previewText: "",
  isLoadingPreview: true,
});

export const createDirectorySearchIdleState = (
  searchStatus,
  previewStatus,
  overrides = {},
) => ({
  searchStatus,
  searchResults: [],
  searchQuery: "",
  selectedEntry: null,
  previewStatus,
  previewDataUrl: "",
  previewText: "",
  isLoadingPreview: false,
  ...overrides,
});

export const createDirectorySearchInProgressState = (query) => ({
  isSearching: true,
  searchStatus: "Searching for matches...",
  searchQuery: query,
  selectedEntry: null,
  previewStatus: "Searching for matches...",
  previewDataUrl: "",
  previewText: "",
  isLoadingPreview: true,
});

// from : handleSearchDirectory
// const matches = Array.isArray(response?.matches) => 
export const createDirectorySearchCompleteState = (matches, status) => ({
  searchResults: matches,
  searchStatus: status,
  selectedEntry: null,
  previewStatus:
    matches.length > 0
      ? "Select a file to preview."
      : "No matching files to preview.",
  previewDataUrl: "",
  previewText: "",
  isLoadingPreview: false,
});

export const createDirectorySelectionCanceledState = () =>
  createDirectoryReadyState({
    tree: null,
    status: "Directory selection canceled.",
    path: "",
    searchStatus: "Directory selection canceled.",
  });


