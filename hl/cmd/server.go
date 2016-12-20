// Copyright © 2016 Elliot Morrison-Reed <elliotmr@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

package cmd

import (
	"encoding/json"
	"net/http"

	"github.com/elliotmr/hexalator/hl/cnv"
	"github.com/spf13/cobra"
	"github.com/Sirupsen/logrus"
)

// serverCmd represents the server command
var serverCmd = &cobra.Command{
	Use:   "server",
	Short: "Run a simple hexalator web server",
	Long: `Run the hexalator web server, it only has one endpoint where it takes
conversion requests and produces conversion responses. A conversion request
has the form:

{
	"type": "integer" || "float" || "string",
	"field": "unsigned_decimal" || "signed_decimal" || "binary" || "hex" || "string",
	"endian": "big" || "little",
	"num_bytes": 1 || 2 || 4 || 8,
	"value": ...
}

If the request is valid it will return a response will all forms of the input values:

{
	"success": true || false,
	"num_bytes": <num_bytes>,
	"result": {
		"unsigned_decimal": <...>,
		"signed_decimal": <...>,
		"binary": <...>,
		"hex": <...>,
		"string": <...>
	}
}`,
	Run: run,
}

func init() {
	RootCmd.AddCommand(serverCmd)
	serverCmd.Flags().StringP("host", "H", "localhost:31337", "ip:port")
}

func HandleConvert(w http.ResponseWriter, r *http.Request) {
	dec := json.NewDecoder(r.Body)
	conversionRequest := cnv.ConversionRequest{}
	if err := dec.Decode(&conversionRequest); err != nil {
		http.Error(w, "unable to decode convesion request", http.StatusBadRequest)
		return
	}
	conversionResult := cnv.Convert(conversionRequest)
	enc := json.NewEncoder(w)
	enc.Encode(&conversionResult)
	return
}

func run(cmd *cobra.Command, args []string) {
	mux := http.NewServeMux()
	mux.HandleFunc("/", HandleConvert)
	host, err := cmd.Flags().GetString("host")
	if err != nil {
		logrus.Fatal(err)
	}
	http.ListenAndServe(host, mux)
}