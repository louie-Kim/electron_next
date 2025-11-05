const formatBytes = (bytes) => {
  if (typeof bytes !== "number" || Number.isNaN(bytes)) {
    return "-";
  }

  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, exponent);

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${
    units[exponent]
  }`;
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return "-";
  }

  try {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  } catch (_error) {
    return "-";
  }
};

// tree -> node
const renderNode = (node) => {
  if (!node) {
    return null;
  }
  // console.log("DirectoryBrowserPanel node",node.children);

  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const tone =
    node.type === "directory"
      ? "border-blue-200 bg-blue-50"
      : "border-slate-200 bg-white";

  return (
    <li key={node.path} className={`rounded-lg border p-3 shadow-sm ${tone}`}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-semibold text-slate-800">
          {node.type === "directory" ? "[DIR]" : "[FILE]"} {node.name}
        </span>
        <span className="text-xs text-slate-500">
          {formatBytes(node.size)} · {formatTimestamp(node.modified)}
        </span>
      </div>
      {hasChildren && (
        <ul className="mt-2 space-y-2 border-l border-slate-200 pl-4 text-sm text-slate-700 list-none">
          {node.children.map((child) => renderNode(child))}
        </ul>
      )}
    </li>
  );
};
// tree={directory.tree}
export default function DirectoryBrowserPanel({
  status,
  tree,
  onBrowse, //  onBrowse={handleBrowseDirectory}
  isBrowsing,
  searchQuery, // searchQuery={directory.searchQuery}
  onSearchChange, // onSearchChange={setDirectorySearchQuery}
  onSearch, // handleSearchDirectory()
  searchResults,   // matches[]
  searchStatus,
  isSearching,
  selectedEntry,   
  onSelectResult,  // onSelectResult = {handleSelectSearchResult}
  previewStatus,
  previewDataUrl, // previewDataUrl = {directory.previewDataUrl}
  previewText,
  isLoadingPreview,
}) {
  return (
    <div className="grid gap-3 border-t border-slate-200 pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">
          Directory Browser
        </h3>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          onClick={onBrowse}
          disabled={isBrowsing}
        >
          {isBrowsing ? "Opening..." : "Select directory"}
        </button>
      </div>
      <p className="text-sm text-slate-600">{status}</p>
      {tree && (
        <ul className="mt-4 space-y-2 list-none p-0 text-sm text-slate-800">
          {renderNode(tree)}
        </ul>
      )}
      {/* 지정 파일 검색하기 */}
      <form
        className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (typeof onSearch === "function") {
            onSearch();
          }
        }}
      >
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Search by name
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery ?? ""}
              onChange={(event) => {
                if (typeof onSearchChange === "function") {
                  onSearchChange(event.target.value);
                }
              }}
              placeholder="Type part of a file or folder name"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              className="shrink-0 rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </label>
        {/* searchStatus={directory.searchStatus} */}
        <p className="text-xs text-slate-500">
          {searchStatus || "Enter text to search in the selected directory."}
        </p>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="grid gap-2">
            {Array.isArray(searchResults) && searchResults.length > 0 ? (
              <ul className="grid gap-2 list-none p-0 text-sm text-slate-800">
                {searchResults.map((match) => {
                  const isSelected =
                    selectedEntry?.path && selectedEntry.path === match.path;
                  return (
                    <li key={match.path}>
                      <button
                        type="button"
                        onClick={() =>
                          typeof onSelectResult === "function" &&
                          onSelectResult(match)
                        }
                        className={`w-full rounded-md border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-slate-900">
                            {match.type === "directory" ? "[DIR]" : "[FILE]"}{" "}
                            {match.name}
                          </span>
                          <span className="break-all text-xs text-slate-500">
                            {match.path}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatBytes(match.size)} ·{" "}
                            {formatTimestamp(match.modified)}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-md border border-dashed border-slate-300 bg-white p-4 text-xs text-slate-500">
                {searchResults && searchResults.length === 0
                  ? "No items matched your search."
                  : "Search results will appear here."}
              </div>
            )}
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-3">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm font-semibold text-slate-900">Preview</h4>
              {selectedEntry?.name && (
                <span className="text-xs text-slate-500">
                  {selectedEntry.name}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {isLoadingPreview ? "Loading preview..." : previewStatus}
            </p>
            {previewDataUrl && (
              <div className="mt-3 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                <img
                  src={previewDataUrl}
                  alt={
                    selectedEntry?.name
                      ? `${selectedEntry.name} preview`
                      : "File preview"
                  }
                  className="h-auto w-full object-contain"
                />
              </div>
            )}
            {previewText && !previewDataUrl && (
              <pre className="mt-3 max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
                {previewText}
              </pre>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

