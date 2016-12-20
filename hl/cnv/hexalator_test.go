package cnv

import (
	"testing"
	"fmt"
	"encoding/json"
)

func TestConvert(t *testing.T) {
	req := ConversionRequest{
		Type: "INTEGER",
		Field: "SignedDecimal",
		Endian: "Big",
		NumBytes: 2,
		Value: "4909",
	}

	res := Convert(req)
	out, _ := json.MarshalIndent(res, "", "  ")
	fmt.Println(string(out))
}