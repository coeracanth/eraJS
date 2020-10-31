import {assertNumber} from "../assert";
import type {Config} from "../config";

export default function parse(values: Map<string, string[][]>): Config["talent"] {
	const rowList = values.get("TALENT.CSV");

	const result = Array<string>(1000).fill("");
	for (const row of rowList ?? []) {
		const index = parseInt(row[0]);
		assertNumber(index, "Index of talent in TALENT.CSV should be an integer");
		result[index] = row[1] ?? "";
	}

	return result;
}
