const fs = require("fs/promises");
const path = require("path");

// createNode(targetPath = filePath (절대 경로), stats)
const createNode = (filePath, stats, children = []) => ({
  name: path.basename(filePath), // 경로의 마지막 세그먼트만 취득, 예: "Y MOTORS-001.png"
  path: filePath, // 절대 경로 전체
  type: stats.isDirectory() ? "directory" : "file",
  size: stats.size,
  modified: stats.mtime.toISOString(), // 수정 시각
  children,
});

// children: 디렉터리 내부 항목 배열
// 이름 기준으로 정렬하면서 디렉터리를 파일보다 먼저 배치
const sortEntries = (entries) =>
  entries.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }

    return a.type === "directory" ? -1 : 1;
  });

// targetPath 예: D:\테스트\A 같은 절대 경로
const buildDirectorySnapshot = async (targetPath) => {
  console.log("targetPath", targetPath);

  // 경로에 대한 메타데이터(파일/디렉터리 여부, 크기, 수정 시간 등)를 조회
  const stats = await fs.lstat(targetPath);
  console.log("stats", stats);

  // 파일이면 자식 없이 노드 생성 후 반환
  if (!stats.isDirectory()) {
    return createNode(targetPath, stats);
  }

  // 디렉터리면 하위 항목을 읽어 재귀적으로 스냅샷 생성
  const dirents = await fs.readdir(targetPath, { withFileTypes: true });
  console.log("dirents", dirents);

  /**
   * childPath 예:
   *  D:\테스트\A\Y MOTORS-001.png
   *  D:\테스트\A\Y모터 상세.zip
   */
  const children = await Promise.all(
    dirents.map(async (dirent) => {
      const childPath = path.join(targetPath, dirent.name); // 하위 경로 생성
      return buildDirectorySnapshot(childPath);
    })
  );

  console.log("children", children); // 생성된 자식 노드 배열

  // 디렉터리 노드를 생성하면서 자식 목록 정렬
  const node = createNode(targetPath, stats, sortEntries(children));
  console.log("parent node:", node);
  return node;
};

module.exports = {
  buildDirectorySnapshot,
};

