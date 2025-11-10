const { dialog } = require("electron");
const fs = require("fs/promises");
const path = require("path");
const { buildDirectorySnapshot } = require("../directoryBrowser");
const { searchDirectoryByName } = require("../directorySearch");

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".bmp",
  ".webp",
  ".ico",
  ".avif",
  ".svg"
]);

const registerFilesystemHandlers = ({ ipcMain, mainWindow }) => {
  ipcMain.removeHandler("filesystem:choose-directory");
  // 4. directory browser
  /**
   * returns
   * {
        canceled: boolean,
        root?: directorySnapshot,
        error?: string
        }
   */
  ipcMain.handle("filesystem:choose-directory", async () => {
    const browserWindow = mainWindow && !mainWindow.isDestroyed()
      ? mainWindow
      : undefined;

    try {
      // 디렉터리 선택 대화 상자를 연다.
      const result = await dialog.showOpenDialog(browserWindow, {
        title: "Select a directory to inspect",
        // 사용자가 디렉터리만 고를 수 있도록 제한한다.
        properties: ["openDirectory"],
        buttonLabel: "Choose directory"
      });

      if (result.canceled || result.filePaths.length === 0) {
        return { canceled: true };
      }

      const targetPath = result.filePaths[0];
      console.log("targetPath", targetPath); // 예: D:\\테스트\\A
      // root = node
      const root = await buildDirectorySnapshot(targetPath);

      return {
        canceled: false,
        root // to useHomeHandlers: handleBrowseDirectory() ->  result -> result.root
      };
    } catch (error) {
      console.error("Directory selection failed", error);
      return {
        canceled: true,
        error: error.message
      };
    }
  });

  ipcMain.removeHandler("filesystem:search-directory");
  //  options = {}  from useHomeHandlers: handleSearchDirectory()
  /**
   * {
        path: directory.path,
        query: trimmedQuery,
      }
   */
  ipcMain.handle("filesystem:search-directory", async (_event, options = {}) => {

    //  예: { path: 'D:\\스크린샷', query: '검색어' }
   console.log("options in main.js search-directory", options);

    const targetPath =
      typeof options.path === "string" && options.path.trim().length > 0
        ? options.path.trim()
        : "";
    const query =
      typeof options.query === "string" && options.query.trim().length > 0
        ? options.query.trim()
        : "";

    if (!targetPath || !query) {
      return {
        matches: [],
        status: "A directory and search term are required.",
      };
    }

    try {

      const matches = await searchDirectoryByName(targetPath, query);
      // return to  response = await electronAPI.searchDirectory( , in useHomeHandlers.js
      return {
        matches,
        status:
          matches.length > 0
            ? `Found ${matches.length} item(s).`
            : "No matching files or folders found.",
      };
    } catch (error) {
      console.error("Directory search failed", error);
      return {
        matches: [],
        status: "Failed to search the directory.",
        error: error.message,
      };
    }
  });

  ipcMain.removeHandler("filesystem:get-preview");
  
  // options = {} from await electronAPI.getFilePreview({ path: targetPath });
  ipcMain.handle("filesystem:get-preview", async (_event, options = {}) => {
    const targetPath =
      typeof options.path === "string" && options.path.trim().length > 0
        ? options.path.trim()
        : "";

    //  D:\스크린샷\오타니.png 절대 경로
    console.log("filesystem:get-preview targetPath", targetPath); 


    if (!targetPath) {
      return {
        error: "A file path is required to generate a preview.",
      };
    }

    try {
      const extension = path.extname(targetPath).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(extension)) {
        return {
          kind: "unsupported",
          status: "Preview not available for this file type.",
        };
      }
      //
      const fileBuffer = await fs.readFile(targetPath);
      // console.log("registerFilesystemHandlers fileBuffer--------------", fileBuffer);

      const mimeType =
        extension === ".svg"
          ? "image/svg+xml"
          : extension === ".ico"
          ? "image/x-icon"
          : extension === ".jpg"
          ? "image/jpeg"
          : `image/${extension.slice(1)}`;

      return {
        kind: "image",
        status: "Image preview ready.",
        dataUrl: `data:${mimeType};base64,${fileBuffer.toString("base64")}`,
        byteLength: fileBuffer.byteLength,
      };
    } catch (error) {
      console.error("File preview failed", error);
      return {
        error: error.message,
        status: "Failed to load preview.",
      };
    }
  });
};

module.exports = {
  registerFilesystemHandlers
};
