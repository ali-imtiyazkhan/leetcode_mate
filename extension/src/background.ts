// CodeMate Background Service Worker (Manifest V3)
// Handles extension lifecycle, badge updates, and cross-tab coordination

// Update badge when a tab navigates to a LeetCode problem
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return
  if (!tab.url?.includes('leetcode.com/problems/')) return

  // Clear badge on navigation (content script will update it via messaging)
  chrome.action.setBadgeText({ text: '', tabId })
  chrome.action.setBadgeBackgroundColor({ color: '#7c3aed', tabId })
})

// Listen for messages from content script (e.g., to update badge)
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'update_badge' && sender.tab?.id) {
    const count = msg.count
    chrome.action.setBadgeText({
      text: count > 99 ? '99+' : count > 0 ? String(count) : '',
      tabId: sender.tab.id,
    })
  }
})
