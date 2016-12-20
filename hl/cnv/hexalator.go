package cnv

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"strconv"
	"strings"

	"github.com/pkg/errors"
)

type ConversionRequest struct {
	Type     string `json:"type"`
	Field    string `json:"field"`
	Endian   string `json:"endian"`
	NumBytes uint   `json:"num_bytes"`
	Value    string `json:"value"`
}

type ConversionResult struct {
	Success  bool        `json:"success"`
	NumBytes uint        `json:"num_bytes"`
	Result   interface{} `json:"result"`
}

func Convert(req ConversionRequest) ConversionResult {
	var bo binary.ByteOrder
	switch strings.ToLower(req.Endian) {
	case "big", "network", "motorola":
		bo = binary.BigEndian
	case "little", "intel":
		bo = binary.LittleEndian
	default:
		return ConversionResult{false, req.NumBytes, "invalid endian"}
	}

	result := ConversionResult{}

	switch strings.ToLower(req.Type) {
	case "integer":
		r := &IntegerConversion{}
		r.Fill(req.Field, bo, req.NumBytes, req.Value)
		result.Success = true
		result.NumBytes = req.NumBytes
		result.Result = r
	default:
		return ConversionResult{false, req.NumBytes, "invalid conversion type"}
	}

	return result
}

type Conversion interface {
	Fill(field string, endian binary.ByteOrder, numBytes uint, value string) error
}

type IntegerConversion struct {
	raw             []byte
	UnsignedDecimal string `json:"unsigned_decimal"`
	SignedDecimal   string `json:"signed_decimal"`
	Binary          string `json:"binary"`
	Hexadecimal     string `json:"hex"`
	UTF8            string `json:"string"`
}

func fillRaw(b []byte, bo binary.ByteOrder, numBytes uint, value uint64) error {
	switch numBytes {
	case 1:
		b[0] = byte(value)
	case 2:
		bo.PutUint16(b, uint16(value))
	case 4:
		bo.PutUint32(b, uint32(value))
	case 8:
		bo.PutUint64(b, uint64(value))
	default:
		return errors.New("numBytes must be 1, 2, 4, or 8")
	}
	return nil
}

func (ic *IntegerConversion) Fill(field string, bo binary.ByteOrder, numBytes uint, value string) error {
	var rawU uint64
	var rawS int64
	var err error
	ic.raw = make([]byte, numBytes)

	switch strings.ToLower(field) {
	case "unsigned_decimal", "unsigneddecimal":
		rawU, err = strconv.ParseUint(value, 10, int(numBytes) * 8)
		if err != nil {
			return errors.Wrap(err, "invalid unsigned decimal")
		}
		err = fillRaw(ic.raw, bo, numBytes, rawU)
		if err != nil {
			return errors.Wrap(err, "invalid unsigned decimal")
		}
	case "signed_decimal", "signeddecimal":
		rawS, err = strconv.ParseInt(value, 10, int(numBytes) * 8)
		if err != nil {
			return errors.Wrap(err, "invalid signed decimal")
		}
		if rawS >= 0 {
			rawU = uint64(rawS)
		} else {
			mask := (uint64(1) << (numBytes * 8)) - 1
			rawU = (mask & uint64(rawS))
		}
		err = fillRaw(ic.raw, bo, numBytes, rawU)
		if err != nil {
			return errors.Wrap(err, "invalid signed decimal")
		}
	case "binary":
		rawU, err = strconv.ParseUint(value, 2, int(numBytes) * 8)
		if err != nil {
			return errors.Wrap(err, "invalid binary")
		}
		err = fillRaw(ic.raw, bo, numBytes, rawU)
		if err != nil {
			return errors.Wrap(err, "invalid binary")
		}
	case "hex":
		rawU, err = strconv.ParseUint(value, 16, int(numBytes) * 8)
		if err != nil {
			return errors.Wrap(err, "invalid hexadecimal")
		}
		err = fillRaw(ic.raw, bo, numBytes, rawU)
		if err != nil {
			return errors.Wrap(err, "invalid hexadecimal")
		}
	case "utf8", "string":
		ic.raw = []byte(value)
		if len(ic.raw) > int(numBytes) {
			return errors.Errorf("string too long %d > %d", len(ic.raw), numBytes)
		}
	default:
		return errors.Errorf("invalid field type: %s", field)
	}


	ic.UnsignedDecimal = fmt.Sprintf("%d", rawU)
	ic.SignedDecimal = fmt.Sprintf("%d", rawS)
	binaryBuf := &bytes.Buffer{}
	hexBuf := &bytes.Buffer{}
	for _, b := range ic.raw {
		binaryBuf.WriteString(fmt.Sprintf("%08b ", b))
		hexBuf.WriteString(fmt.Sprintf("%02X ", b))
	}
	ic.Binary = strings.TrimSpace(binaryBuf.String())
	ic.Hexadecimal = strings.TrimSpace(hexBuf.String())
	ic.UTF8 = string(ic.raw)
	return nil
}