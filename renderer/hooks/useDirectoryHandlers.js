import { useCallback } from "react";
import withErrorHandling from "./withErrorHandling";
import {
  createDirectoryUnavailableState,
  createDirectoryReadyState,
  createDirectoryPreviewResetState,
  createDirectoryPreviewLoadingState,
  createDirectorySearchIdleState,
  createDirectorySearchInProgressState,
  createDirectorySearchCompleteState,
  createDirectorySelectionCanceledState,
} from "./directoryStateHelpers";

// ...homeState : directory, updateDirectory, setDirectorySearchQuery
// ...electronBridge : electronAPI
const useDirectoryHandlers = ({
  directory,
  updateDirectory,
  setDirectorySearchQuery,
  electronAPI,
}) => {
  // Select directory 버튼 클릭!
  const handleBrowseDirectory = useCallback(
    withErrorHandling(
      async () => {
        if (!electronAPI?.browseDirectory) {
          updateDirectory({
            ...createDirectoryUnavailableState(),
          });
          return;
        }

        updateDirectory({
          isBrowsing: true,
          status: "Waiting for directory selection...",
          searchResults: [],
          selectedEntry: null,
          ...createDirectoryPreviewResetState("Select a file to preview."),
        });

        // after : const root = await buildDirectorySnapshot(targetPath);
        // (root = node) -> result
        const result = await electronAPI.browseDirectory();

        if (!result || result.canceled) {
          updateDirectory(createDirectorySelectionCanceledState());
          return;
        }
        // result.root = node
        console.log("handleBrowerDirectory result.root", result.root);

        if (result.root) {
          updateDirectory(
            createDirectoryReadyState({
              tree: result.root,
              status: "Directory tree loaded.",
              // 선택한 디렉터리 트리를 Search by name 입력에서 재사용할 수 있도록 경로를 유지한다.
              // await electronAPI.searchDirectory(...) 호출 시 path 옵션으로 directory.path를 전달한다. (path: directory.path)
              path: result.root.path || "",
            }),
          );
        } else {
          updateDirectory(
            createDirectoryReadyState({
              tree: null,
              status: "No directory data received.",
              searchStatus: "No directory data received.",
              path: "",
            }),
          );
        }
      },
      {
        label: "Directory browse failed",
        onError: () =>
          updateDirectory({
            status: "Failed to browse directory.",
          }),
        onFinally: () => updateDirectory({ isBrowsing: false }),
      },
    ),
    [electronAPI, updateDirectory],
  );

  // Search by name : Search 버튼 클릭!
  const handleSearchDirectory = useCallback(
    withErrorHandling(
      async () => {
        if (!electronAPI?.searchDirectory) {
          updateDirectory({
            ...createDirectorySearchIdleState(
              "Directory search not available outside Electron.",
              "File preview not available outside Electron.",
              {
                searchQuery: directory.searchQuery,
              },
            ),
          });
          return;
        }

        if (!directory.path) {
          updateDirectory({
            ...createDirectorySearchIdleState(
              "Select a directory first.",
              "Select a directory first.",
            ),
          });
          return;
        }

        const rawQuery =
          typeof directory.searchQuery === "string"
            ? directory.searchQuery
            : "";
        const trimmedQuery = rawQuery.trim();

        if (trimmedQuery.length === 0) {
          updateDirectory({
            ...createDirectorySearchIdleState(
              "Enter a search term.",
              "Enter a search term to preview results.",
            ),
          });
          return;
        }

        updateDirectory({
          ...createDirectorySearchInProgressState(trimmedQuery),
        });
        /**
         * main.js
         * ipcMain.handle("filesystem:search-directory")에서 응답으로 내려주는 객체 예시
         * response = {
         *   matches,
         *   status:
         *     matches.length > 0
         *       ? `Found ${matches.length} item(s).`
         *       : "No matching files or folders found."
         * };
         */
        const response = await electronAPI.searchDirectory({
          path: directory.path,
          query: trimmedQuery,
        });

        if (response?.error) {
          updateDirectory({
            ...createDirectorySearchIdleState(
              response.status || "Failed to search the directory.",
              response.status || "Failed to search the directory.",
            ),
          });
          return;
        }

        const matches = Array.isArray(response?.matches)
          ? response.matches
          : [];
        updateDirectory({
          ...createDirectorySearchCompleteState(
            matches,
            response?.status || "Search complete.",
          ),
        });
      },
      {
        label: "Directory search failed",
        onError: () =>
          updateDirectory({
            ...createDirectorySearchIdleState(
              "Failed to search the directory.",
              "Failed to search the directory.",
            ),
          }),
        onFinally: () =>
          updateDirectory({ isSearching: false, isLoadingPreview: false }),
      },
    ),
    [directory.path, directory.searchQuery, electronAPI, updateDirectory],
  );

  // 이미지 검색 결과 항목 클릭! -> 프리뷰
  const handleSelectSearchResult = useCallback(
    withErrorHandling(
      async (entry) => {
        // <button onSelectResult(match)> 에서 전달되는 entry 객체
        console.log("handleSelectSearchResult entry---", entry);
        /**
         * entry
         * {
            "name": "샘플.png",
            "path": "D:\\스크린샷\\샘플.png",
            "type": "file",
            "size": 188862,
            "modified": "2025-11-04T07:59:03.482Z"
        }
         */
        if (!entry) {
          updateDirectory({
            selectedEntry: null,
            ...createDirectoryPreviewResetState("Select a file to preview."),
          });
          return;
        }

        if (entry.type === "directory") {
          updateDirectory({
            selectedEntry: entry,
            ...createDirectoryPreviewResetState(
              "Preview not available for directories.",
            ),
          });
          return;
        }

        const targetPath = entry.path;
        updateDirectory({
          ...createDirectoryPreviewLoadingState(entry),
        });

        if (!electronAPI?.getFilePreview) {
          updateDirectory({
            ...createDirectoryPreviewResetState(
              "File preview not available outside Electron.",
            ),
          });
          return;
        }

        const response = await electronAPI.getFilePreview({ path: targetPath });
        console.log("await electronAPI.getFilePreview response", response);
        /**
         * response
         * {
            "kind": "image",
            "status": "Image preview ready.",
            "dataUrl": "data:image/png;base64,iV+Gz7p27s+..."
            "byteLength": 188862
          }
         */

        if (
          directory.selectedEntry &&
          directory.selectedEntry.path !== targetPath
        ) {
          return;
        }
        if (response?.error) {
          updateDirectory({
            ...createDirectoryPreviewResetState(
              response.status || response.error || "Failed to load preview.",
            ),
          });
          return;
        }

        // response.status , response.dataUrl 업데이트
        if (response?.kind === "image" && response?.dataUrl) {
          updateDirectory({
            previewStatus: response.status || "Image preview ready.",
            previewDataUrl: response.dataUrl,
            previewText: "",
            isLoadingPreview: false,
          });
          return;
        }

        // directory state : preview 상태 데이터를 기본값으로 초기화
        updateDirectory({
          ...createDirectoryPreviewResetState(
            response?.status || "Preview not available for this file type.",
          ),
        });
      },
      {
        label: "File preview request failed",
        onError: () =>
          updateDirectory({
            ...createDirectoryPreviewResetState("Failed to load preview."),
          }),
      },
    ),
    [directory.selectedEntry?.path, electronAPI, updateDirectory],
  );

  return {
    state: {
      directory,
    },
    actions: {
      setDirectorySearchQuery,
    },
    handlers: {
      handleBrowseDirectory,
      handleSearchDirectory,
      handleSelectSearchResult,
    },
  };
};

export default useDirectoryHandlers;
