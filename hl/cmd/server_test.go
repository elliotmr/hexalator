package cmd

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/elliotmr/hexalator/hl/cnv"
)

func TestHandleConvert(t *testing.T) {
	mux := http.NewServeMux()
	mux.HandleFunc("/", HandleConvert)
	s := httptest.NewServer(mux)

	buf := &bytes.Buffer{}
	enc := json.NewEncoder(buf)
	enc.Encode(&cnv.ConversionRequest{
		Type: "INTEGER",
		Field: "SignedDecimal",
		Endian: "Big",
		NumBytes: 2,
		Value: "4909",
	})

	c := &http.Client{}
	rsp, err := c.Post(s.URL, "application/json", buf)
	if err != nil {
		t.Error(err)
	}

	rslt := cnv.ConversionResult{}
	dec := json.NewDecoder(rsp.Body)
	err = dec.Decode(&rslt)
	if err != nil {
		t.Error(err)
	}

	t.Log(rslt)
}