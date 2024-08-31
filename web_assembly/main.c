#include <emscripten.h>

EM_JS(void, call_alert, (const char *param), {
  var message = UTF8ToString(param);
  functionInJS(message); 
});

EM_JS(void, call_alert2, (const char *param), {
  var message = UTF8ToString(param);
  functionInJS(message); 
});

int main() {
  const char *message = "Hallo!";
  call_alert(message); 
  call_alert2(message); 
  return 0;
}
