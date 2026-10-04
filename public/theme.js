(function () {
  var key = 'khadija-theme';
  var preference = 'auto';
  try { preference = localStorage.getItem(key) || 'auto'; } catch (_) {}
  if (!['auto', 'light', 'dark'].includes(preference)) preference = 'auto';
  function apply() {
    var hour = new Date().getHours();
    var theme = preference === 'auto' ? (hour >= 19 || hour < 7 ? 'dark' : 'light') : preference;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.dispatchEvent(new CustomEvent('khadija-theme-applied', {detail: {preference: preference, theme: theme}}));
  }
  window.addEventListener('khadija-theme-change', function (event) {
    if (!['auto', 'light', 'dark'].includes(event.detail)) return;
    preference = event.detail;
    try { localStorage.setItem(key, preference); } catch (_) {}
    apply();
  });
  window.addEventListener('storage', function (event) {
    if (event.key !== key) return;
    preference = ['light', 'dark'].includes(event.newValue) ? event.newValue : 'auto';
    apply();
  });
  window.addEventListener('focus', apply);
  document.addEventListener('visibilitychange', apply);
  apply();
  setInterval(apply, 30000);
})();
