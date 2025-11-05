const HISTORY_LIMIT = 5;

const normalizeEntry = (entry = {}) => ({
  payload: entry.payload ?? '',
  echo: entry.echo ?? '',
  handledAt: entry.handledAt ?? ''
});

const appendHistoryEntry = (history, entry, limit = HISTORY_LIMIT) => {
  console.log("entry-----------", entry);
  
  
  // history가 배열인지 확인
  if (!Array.isArray(history)) {
    throw new TypeError('history must be an array');
  }
  
  // entry 객체 정규화
  /**
   * {
  payload: text,
  echo: response.echo,
  handledAt: response.handledAt
  }
  */
 
  // 최신 엔트리를 배열 앞쪽에 추가
 history.unshift(normalizeEntry(entry));
 console.log("history-----------",history);

  if (history.length > limit) {
    // 배열 크기를 제한
    history.length = limit;
  }
  // ipcHistory.test.js에서 테스트 용도로 반환
  return history;
};

// 얕은 복사 -> UI 렌더러와 참조 무결성을 유지
const getHistorySnapshot = (history) => Array.isArray(history)
  ? history.map((entry) => ({ ...entry })) // 얕은 복사본 반환
  : [];

module.exports = {
  HISTORY_LIMIT,
  appendHistoryEntry,
  getHistorySnapshot
};
