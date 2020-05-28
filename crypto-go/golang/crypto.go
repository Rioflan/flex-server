package main 
import ( 
 "encoding/base64" 
 "crypto/aes" 
 "crypto/cipher" 
 "C"
)

// var iv = []byte{35, 46, 57, 24, 85, 35, 24, 74, 87, 35, 88, 98, 66, 32, 14, 05, 35, 46, 57, 24, 85, 35, 24, 74, 87, 35, 88, 98, 66, 32, 14, 05} 
 
func encodeBase64(b []byte) string { 
 return base64.StdEncoding.EncodeToString(b) 
} 
 
func decodeBase64(s string) []byte { 
 data, err := base64.StdEncoding.DecodeString(s) 
 if err != nil { panic(err) } 
 return data 
} 
 //export Encrypt
func Encrypt(keyValue, textValue *C.char) *C.char { 
key := C.GoString(keyValue)
text := C.GoString(textValue)
 block, err := aes.NewCipher([]byte(key)) 
 if err != nil { panic(err) } 
 plaintext := []byte(text) 
 ciphertextIV := make([]byte, aes.BlockSize+len(plaintext))
 iv := ciphertextIV[:aes.BlockSize]
 cfb := cipher.NewCFBEncrypter(block, iv) 
 ciphertext := make([]byte, len(plaintext)) 
 cfb.XORKeyStream(ciphertext, plaintext) 
 return C.CString(encodeBase64(ciphertext))
} 
 //export Decrypt
func Decrypt(keyValue, textValue *C.char) *C.char { 
key := C.GoString(keyValue)
text := C.GoString(textValue)
 block, err := aes.NewCipher([]byte(key)) 
 if err != nil { panic(err) } 
 ciphertext := decodeBase64(text) 
 plaintextIV := []byte(text) 
 ciphertextIV := make([]byte, aes.BlockSize+len(plaintextIV))
 iv := ciphertextIV[:aes.BlockSize]
 cfb := cipher.NewCFBEncrypter(block, iv) 
 plaintext := make([]byte, len(ciphertext)) 
 cfb.XORKeyStream(plaintext, ciphertext) 
 return C.CString(string(plaintext))
} 

func main() {}