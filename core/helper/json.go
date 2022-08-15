package helper

import "encoding/json"

func ToJSON(data any) []byte {
	bytes, err := json.Marshal(data)
	if err != nil {
		panic(err)
	}

	return bytes
}

func FromJSON(data []byte) map[string]string {
	var result map[string]string

	err := json.Unmarshal(data, &result)
	if err != nil {
		panic(err)
	}

	return result
}
