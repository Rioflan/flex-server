#include <node.h>
#include "../crypto.h"

namespace crypto {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

const char* ToCString(const String::Utf8Value& value) {
  return *value ? *value : "<string conversion failed>";
}

void MethodEncrypt(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  String::Utf8Value str(args[0]);
  String::Utf8Value str2(args[1]);
  const char* cstr = ToCString(str);
  const char* cstr2 = ToCString(str2);
  char * charstr = const_cast<char *>(cstr);
  char * charstr2 = const_cast<char *>(cstr2);
  char* result = Encrypt(charstr, charstr2);
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, result));
}

void MethodDecrypt(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  String::Utf8Value str(args[0]);
  String::Utf8Value str2(args[1]);
  const char* cstr = ToCString(str);
  const char* cstr2 = ToCString(str2);
  char * charstr = const_cast<char *>(cstr);
  char * charstr2 = const_cast<char *>(cstr2);
  char* result = Decrypt(charstr, charstr2);
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, result));
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "encrypt", MethodEncrypt);
  NODE_SET_METHOD(exports, "decrypt", MethodDecrypt);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)

}