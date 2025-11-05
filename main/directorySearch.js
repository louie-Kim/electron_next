const path = require("path");
const fsExtra = require("fs-extra");

// directoryPath: 탐색할 디렉터리 경로, keyword: 검색어
// targetPath, query => main 프로세스에서 전달된 directoryPath, keyword와 동일
const searchDirectoryByName = async (directoryPath, keyword) => {
  if (typeof directoryPath !== "string" || directoryPath.trim().length === 0) {
    throw new Error("A directory path is required.");
  }

  const trimmedKeyword =
    typeof keyword === "string" ? keyword.trim().toLowerCase() : "";
  if (trimmedKeyword.length === 0) {
    return [];
  }

  const matches = [];

  const walk = async (currentPath) => {
    // targetPath === directoryPath === currentPath
    let entries;
    try {
      entries = await fsExtra.readdir(currentPath);
    } catch (_error) {
      return;
    }

    // entries: currentPath 하위의 파일/폴더 이름 배열
    for (const entryName of entries) {
      const entryPath = path.join(currentPath, entryName); // 절대 경로 조합
      let stats;
      try {
        stats = await fsExtra.stat(entryPath);
      } catch (_error) {
        continue;
      }

      const normalizedName = entryName.toLowerCase(); // 파일 이름을 소문자로 변환
      if (normalizedName.includes(trimmedKeyword)) {
        matches.push({
          name: entryName, // 파일 이름
          path: entryPath, // 절대 경로
          type: stats.isDirectory() ? "directory" : "file",
          size: stats.size,
          modified: stats.mtime.toISOString(),
        });
      }

      /**
       * 디렉터리를 만나면 재귀 호출로 하위 폴더까지 계속 탐색하고,
       * 파일을 만나면 현재 위치에서 검사 후 정보만 기록한다.
       */
      if (stats.isDirectory()) {
        // 하위 폴더 재귀 탐색
        await walk(entryPath);
      }
    }
  };

  await walk(directoryPath);

  return matches;
};

module.exports = {
  searchDirectoryByName,
};

